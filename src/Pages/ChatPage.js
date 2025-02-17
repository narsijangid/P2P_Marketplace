import { useContext, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import OlxLogo from "../assets/OlxLogo";
import AllChat from "../Components/AllChats/AllChat";
import Chat from "../Components/Chat/Chat";
import Header from "../Components/Header/Header"
import { AuthContext } from "../store/Context";
import "./ChatPage.css"

const ChatPage = () => {
    const { user } = useContext(AuthContext);
    const { chatId } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (!user) {
            return <Redirect to={{
                pathname: "/",
                state: { from: "create" }
            }} />
        }
        return () => {

        }
    }, [user])

    return (
        <div className="chat__page">
         
            <div className="chatPage__main">
                <div className="chatPage__container">
                    <div className={(chatId !== 'chatid') ? 'allChat__only chatPage__allChat' : 'chatPage__allChat'}>
                        <AllChat />
                    </div>
                    <div className={(chatId === 'chatid') ? ' chat__only chatPage__chats' : 'chatPage__chats'}>
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;