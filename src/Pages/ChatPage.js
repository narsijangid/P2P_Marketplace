import React from 'react';
import { useContext, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import Header from "../Components/Header/Header";
import Footer from '../Components/Footer/Footer';
import AllChat from "../Components/AllChats/AllChat";
import Chat from "../Components/Chat/Chat";
import { AuthContext } from "../store/Context";
import "./ChatPage.css";

const ChatPage = () => {
    const { user } = useContext(AuthContext);
    const { chatId } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (!user) {
            history.push('/');
        }
    }, [user, history]);

    if (!user) {
        return null;
    }

    return (
        <div className="chatPage">
            <Header />
            <div className="chatPage__container">
                <div className="chatPage__sidebar">
                    <div className="chatPage__sidebarHeader">
                        <h2>Messages</h2>
                    </div>
                    <div className="chatPage__chatList">
                        <AllChat />
                    </div>
                </div>
                <div className="chatPage__main">
                    {chatId ? (
                        <Chat />
                    ) : (
                        <div className="chatPage__welcome">
                            <h2>Welcome to Messages</h2>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChatPage;