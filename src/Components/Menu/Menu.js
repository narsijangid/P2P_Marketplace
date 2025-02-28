import { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import Arrow from '../../assets/Arrow';
import db, { auth } from '../../firebase';
import { AuthContext } from '../../store/Context';
import "./Menu.css";
import { Link } from 'react-router-dom';
import { IoChatboxEllipses } from "react-icons/io5";
import { RiRobot3Line } from "react-icons/ri";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import { GrFavorite } from "react-icons/gr";
import { IoIosHelpCircleOutline } from "react-icons/io";

function GotChatapp(){
  window.location.href = "https://about.free4talk.xyz/#help";
}

const Menu = () => {
  const { user } = useContext(AuthContext)
  const [popOn, setPopOn] = useState(false);
  const [chatbotPopup, setChatbotPopup] = useState(false);
  const [userDetails, setUserDetails] = useState([])
  let menuRef = useRef();
  const history = useHistory();

  useEffect(() => {
    db.collection('users').doc(`${user.uid}`).get().then(res => {
      setUserDetails(res.data())
    })
    return () => {
      
    }
  }, [user])

  useEffect(() => {
    if (user) {
      let handler = (event) => (!menuRef.current.contains(event.target)) && setPopOn(false)
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler)
      }
    }
  })

  const toggleChatbotPopup = () => {
    setChatbotPopup(!chatbotPopup);
  }

  return (
    <div className="menu">
      <div className="user__present">
        <div ref={menuRef} className="popover__container">
          <div onClick={() => setPopOn(!popOn)} className="pop__btn">
            <img 
              className="profile__pic" 
              src={userDetails?.photourl || "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"} 
              alt="img" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "/default-profile.png"; // Default image on error
              }}
            />
            <div className={popOn ? 'menu__arrow' : "menu__arrowDown"}>
              <Arrow />
            </div>
          </div>

          <div className={popOn ? "pop__active" : "pop__disabled"}>
            <div className="arrow-up"></div>
            <div className="pop__contents">
              <div className="menu__profile">
                <img src={userDetails?.photourl || "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"} alt="img" />
                <div onClick={() => history.push('/editProfile/info')} className="menu__profileDiv">
                  <h6>Hello,</h6>
                  <h4>{userDetails?.username}</h4>
                  <h6>View profile</h6>
                </div>
              </div>
             
              <div onClick={() => history.push('/myads')} className="menu__section">
                <BsFillPostcardHeartFill  className='babuhichat' />
                <h5>My Post</h5>
              </div>
              {/* <div className="menu__section" onClick={toggleChatbotPopup}>
                <RiRobot3Line className='babuhichat' />
                <h5>Ai ChatBot</h5>
              </div> */}
              <Link to="chat/chatid" className="menu__section horizontal__line">
                <IoChatboxEllipses className='babuhichat'  />
                <h5>Chat</h5>
              </Link>

              <div className="menu__section">
                <IoIosHelpCircleOutline className='chatboboico' />
                <h5 onClick={GotChatapp}>Help</h5>
              </div>

              <Link to="myfavorites" className="menu__section horizontal__line">
                <GrFavorite  className='favoritbabo'/>
                <h5>Favorite</h5>
              </Link>

              <div onClick={() => {
                auth.signOut()
                history.push('/')
                }} className="menu__section">
                <i className="bi bi-box-arrow-left"></i>
                <h5 >Logout</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chatbotPopup && (
        <div className="chatbot-popup">
          <div className="chatbot-popup-content">
            <button className="close-btn" onClick={toggleChatbotPopup}>×</button>
            <iframe 
              src="https://ai.free4talk.xyz/" 
              title="AI Chatbot" 
              width="100%" 
              height="100%"
              frameBorder="0"
              style={{ overflow: 'hidden' }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;