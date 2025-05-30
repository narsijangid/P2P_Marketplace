import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import db from "../../firebase";
import { AuthContext } from "../../store/Context";
import "./Chat.css";
import { IoSend } from "react-icons/io5";
import { BiArrowBack } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { chatId } = useParams();
    const [text, setText] = useState('');
    const [chatList, setChatList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const messagesEndRef = useRef(null);
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            history.push('/');
        }
    }, [user, history]);

    // Fetch user details
    useEffect(() => {
        if (user) {
            db.collection('users').doc(`${user.uid}`).get().then(res => {
                if (res.exists) {
                    setUserDetails(res.data());
                }
            }).catch(error => {
                console.error("Error fetching user details:", error);
            });
        }
    }, [user]);

    // Fetch chat list with user details
    useEffect(() => {
        if (user) {
            const fetchChats = async () => {
                try {
                    const snapshot = await db.collection('chat')
                        .where('users', 'array-contains', user.uid)
                        .get();

                    const chats = await Promise.all(snapshot.docs.map(async doc => {
                        try {
                            const chatData = doc.data();
                            if (!chatData || !chatData.users) {
                                console.error("Invalid chat data:", doc.id);
                                return null;
                            }

                            const otherUserId = chatData.users.find(id => id !== user.uid);
                            if (!otherUserId) {
                                console.error("Could not find other user in chat:", doc.id);
                                return null;
                            }

                            // Get other user's details
                            const otherUserDoc = await db.collection('users').doc(otherUserId).get();
                            if (!otherUserDoc.exists) {
                                console.error("Other user not found:", otherUserId);
                                return null;
                            }

                            const otherUserData = otherUserDoc.data();
                            if (!otherUserData) {
                                console.error("No user data found for:", otherUserId);
                                return null;
                            }

                            // Get last message
                            const lastMessageSnapshot = await db.collection('chat')
                                .doc(doc.id)
                                .collection('messages')
                                .orderBy('createdAt', 'desc')
                                .limit(1)
                                .get();

                            const lastMessage = lastMessageSnapshot.docs[0]?.data();

                            return {
                                id: doc.id,
                                otherUser: {
                                    id: otherUserId,
                                    username: otherUserData.username || 'Unknown User',
                                    photoURL: otherUserData.photourl || "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png",
                                    online: otherUserData.online || false,
                                    lastSeen: otherUserData.lastSeen
                                },
                                lastMessage: lastMessage ? {
                                    text: lastMessage.text,
                                    createdAt: lastMessage.createdAt.toDate(),
                                    senderId: lastMessage.userId
                                } : null
                            };
                        } catch (error) {
                            console.error("Error processing chat:", doc.id, error);
                            return null;
                        }
                    }));

                    // Filter out any null values from failed chat processing
                    const validChats = chats.filter(chat => chat !== null);
                    setChatList(validChats);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching chats:", error);
                    setLoading(false);
                }
            };

            fetchChats();
        }
    }, [user]);

    // Fetch messages for specific chat
    useEffect(() => {
        if (chatId) {
            const unsubscribe = db.collection('chat').doc(`${chatId}`).collection('messages')
                .orderBy("createdAt", "asc")
                .onSnapshot(snapshot => {
                    const allMessages = snapshot.docs.map((message) => ({
                        ...message.data(),
                        id: message.id,
                        date: message.data().createdAt.toDate(),
                        hour: message.data().createdAt.toDate().toLocaleString('en-IN', { 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            hour12: true 
                        })
                    }));
                    setMessages(allMessages);
                });
            return () => unsubscribe();
        }
    }, [chatId]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            await db.collection('chat').doc(`${chatId}`).collection('messages').add({
                text: text.trim(),
                createdAt: new Date(),
                userId: user.uid,
                username: userDetails.username
            });
            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getLastSeen = (lastSeen) => {
        if (!lastSeen) return '';
        
        const lastSeenDate = lastSeen.toDate();
        const now = new Date();
        const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return lastSeenDate.toLocaleDateString();
    };

    const filteredChatList = chatList.filter(chat => 
        chat.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="chat__loading">
                <div className="chat__loadingSpinner"></div>
                <p>Loading chats...</p>
            </div>
        );
    }

    // Chat List View
    if (!chatId) {
        return (
            <div className="chat__container">
                <div className="chat__header">
                    <h2>Messages</h2>
                    <div className="chat__search">
                        <BsSearch />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="chat__list">
                    {filteredChatList.length > 0 ? (
                        filteredChatList.map(chat => (
                            <div
                                key={chat.id}
                                className="chat__listItem"
                                onClick={() => history.push(`/chat/${chat.id}`)}
                            >
                                <div className="chat__listItemAvatar">
                                    <img src={chat.otherUser.photoURL} alt={chat.otherUser.username} />
                                    <span className={`chat__status ${chat.otherUser.online ? 'online' : ''}`} />
                                </div>
                                <div className="chat__listItemContent">
                                    <div className="chat__listItemHeader">
                                        <h3>{chat.otherUser.username}</h3>
                                        {chat.lastMessage && (
                                            <span className="chat__listItemTime">
                                                {chat.lastMessage.createdAt.toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="chat__listItemMessage">
                                        {chat.lastMessage ? (
                                            <p className={chat.lastMessage.senderId === user.uid ? 'sent' : ''}>
                                                {chat.lastMessage.text}
                                            </p>
                                        ) : (
                                            <p className="chat__noMessage">No messages yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="chat__empty">
                            <p>No chats found</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Individual Chat View
    const currentChat = chatList.find(chat => chat.id === chatId);
    if (!currentChat) {
        history.push('/chat');
        return null;
    }

    return (
        <div className="chat__container">
            <div className="chat__header">
                <div className="chat__headerLeft">
                    <BiArrowBack onClick={() => history.push('/chat')} />
                    <div className="chat__userInfo">
                        <h3>{currentChat.otherUser.username}</h3>
                        <span className={`chat__status ${currentChat.otherUser.online ? 'online' : ''}`}>
                            {currentChat.otherUser.online ? 'Online' : `Last seen ${getLastSeen(currentChat.otherUser.lastSeen)}`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="chat__messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat__message ${message.userId === user.uid ? 'sent' : 'received'}`}
                    >
                        <div className="chat__messageContent">
                            <p>{message.text}</p>
                            <span className="chat__messageTime">{message.hour}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat__inputContainer" onSubmit={handleSend}>
                <div className="chat__inputWrapper">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">
                        <IoSend />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;