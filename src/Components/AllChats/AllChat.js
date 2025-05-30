import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import db from "../../firebase";
import { AuthContext } from "../../store/Context";
import "./AllChat.css";

const AllChat = () => {
    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const history = useHistory();

    useEffect(() => {
        let isMounted = true;
        if (user) {
            const unsubscribe = db.collection('chat')
                .where('users', 'array-contains', user.uid)
                .onSnapshot(snapshot => {
                    if (isMounted) {
                        const allChats = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setChats(allChats);
                    }
                });
            return () => {
                isMounted = false;
                unsubscribe();
            };
        }
    }, [user]);

    const handleChatClick = (chatId) => {
        history.push(`/chat/${chatId}`);
    };

    return (
        <div className="allChat">
            {chats.map(chat => {
                const otherUser = chat.users.find(id => id !== user.uid);
                return (
                    <div
                        key={chat.id}
                        className="allChat__item"
                        onClick={() => handleChatClick(chat.id)}
                    >
                        <div className="allChat__avatar">
                            <img src={chat.userPhoto || 'https://via.placeholder.com/40'} alt="User" />
                        </div>
                        <div className="allChat__content">
                            <div className="allChat__header">
                                <h3>{chat.userName}</h3>
                                <span className="allChat__time">
                                    {chat.lastMessage?.createdAt?.toDate().toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </span>
                            </div>
                            <p className="allChat__message">
                                {chat.lastMessage?.text || 'No messages yet'}
                            </p>
                        </div>
                    </div>
                );
            })}
            {chats.length === 0 && (
                <div className="allChat__empty">
                    <p>No conversations yet</p>
                </div>
            )}
        </div>
    );
};

export default AllChat;