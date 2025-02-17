import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import db from "../../firebase";
import { AuthContext } from "../../store/Context";
import "./Chat.css";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { chatId } = useParams();
    const [text, setText] = useState('');
    const [userNames, setUserNames] = useState([]);
    const [userId, setUserId] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [forbidden, setForbidden] = useState(false);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [otherPreson, setOtherPreson] = useState();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        db.collection("chat").doc(`${chatId}`).get().then(res => {
            setUserId(res.data()?.users);
        })
        setLoading(false);
    }, [chatId, user]);

    useEffect(() => {
        (userId?.includes(user?.uid)) ? setForbidden(false) : setForbidden(true);
    }, [user, userId]);

    useEffect(() => {
        db.collection('chat').doc(`${chatId}`).collection('messages').orderBy("createdAt", "asc").onSnapshot(snapshot => {
            const allMessages = snapshot.docs.map((message) => {
                return {
                    ...message.data(),
                    id: message.id,
                    date: message.data().createdAt.toDate(),
                    hour: message.data().createdAt.toDate().toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, day: 'numeric', month: 'numeric', year: 'numeric' }),
                }
            })
            setMessages(allMessages);
        })
    }, [chatId]);

    useEffect(() => {
        db.collection('users').doc(`${user?.uid}`).get().then(res => {
            setUserDetails(res.data());
        })
    }, [user, chatId]);

    useEffect(() => {
        db.collection("chat").doc(`${chatId}`).get().then(res => {
            setUserNames({
                user1: res.data()?.user1,
                user2: res.data()?.user2
            });
        });
    }, [chatId, user]);

    useEffect(() => {
        if (user && userId) {
            if (userId[0] === user.uid) {
                db.collection('users').doc(userId[1]).get().then(res => {
                    setOtherPreson(res.data());
                });
            } else {
                db.collection('users').doc(userId[0]).get().then(res => {
                    setOtherPreson(res.data());
                });
            }
        }
    }, [user, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendText = (e) => {
        e.preventDefault();
        if (text !== '') {
            db.collection('chat').doc(`${chatId}`).collection('messages').add({
                text: text,
                createdAt: new Date(),
                sender: user.uid
            }).then(() => {
                setText('');
            });
        }
    };

    // Detect keyboard visibility
    useEffect(() => {
        const handleKeyboard = () => {
            setKeyboardVisible(window.innerHeight < document.documentElement.scrollHeight);
        };
        window.addEventListener('resize', handleKeyboard);
        handleKeyboard();
        return () => {
            window.removeEventListener('resize', handleKeyboard);
        };
    }, []);

    return (
        <div className={`chat__main ${keyboardVisible ? "keyboard-visible" : ""}`}>
            {
                ((chatId !== 'chatid') && !forbidden) &&
                <div className="chat__header" style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    <i onClick={() => history.goBack()} className="bi bi-arrow-left-short chat__backArrow"></i>
                    <img
                        onClick={() => {
                            (user.uid !== userId[0]) ?
                                history.push(`/profile/${userId[0]}`)
                                :
                                history.push(`/profile/${userId[1]}`)
                        }}
                        style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
                        src={otherPreson?.photourl}
                        alt=""
                    />
                    {
                        ((userNames?.user1 === userDetails?.username) || (userNames?.user1 === user?.displayName)) ?
                            <h4 onClick={() => {
                                (user.uid !== userId[0]) ?
                                    history.push(`/profile/${userId[0]}`)
                                    :
                                    history.push(`/profile/${userId[1]}`)
                            }}>
                                {userNames?.user2}
                            </h4>
                            :
                            <h4 onClick={() => {
                                (user.uid !== userId[0]) ?
                                    history.push(`/profile/${userId[0]}`)
                                    :
                                    history.push(`/profile/${userId[1]}`)
                            }}>
                                {userNames?.user1}
                            </h4>
                    }
                </div>
            }
            {
                loading ?
                    <h2>Loading...</h2>
                    :
                    forbidden ?
                        <h2 className="chat__warning">You can't message in this group</h2>
                        :
                        <div className="chat__messageContainer">
                            {messages?.map((msg, i) => (
                                <div key={i} className={msg.sender === user.uid ? 'chat__messageSend' : 'chat__messageReceive'}>
                                    <div className="chat__messageText">{msg.text}</div>
                                    <div className="chat__messageTime">{msg.hour}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
            }
            <div className="chat__inputContainer">
                <input
                    className="chat__input"
                    type="text"
                    placeholder="Type a message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <i onClick={sendText} className="bi bi-send chat__sendButton"></i>
            </div>
        </div>
    );
}

export default Chat;
