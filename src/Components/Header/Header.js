import React, { useContext, useState, useEffect } from 'react';
import './Header.css';
import OlxLogo from '../../assets/OlxLogo';
import Search from '../../assets/Search';
import Arrow from '../../assets/Arrow';
import SellButton from '../../assets/SellButton';
import SellButtonPlus from '../../assets/SellButtonPlus';
import { useHistory, useLocation } from 'react-router';
import { AuthContext } from '../../store/Context';
import Menu from '../Menu/Menu';
import Login from '../Login/Login';




function Header() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [loginPopOn, setLoginPopOn] = useState(false);
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [locationSearch, setLocationSearch] = useState('');


  useEffect(() => {
    if (location?.state?.from === 'create') {
      setLoginPopOn(true)
    }
  }, [location?.state?.from])


  const handleSellClick = () => {
    (user ? history.push('/create') : setLoginPopOn(true))
  }

  const handleLogin = () => {
    setLoginPopOn(!loginPopOn);
  }
  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search/search?${searchInput} ${locationSearch}`)
  }


  return (
    <div className="header__main">
      <div onClick={() => history.push('/')} className="brandName">
        <OlxLogo />
      </div>
      <form className="placeSearch" onSubmit={handleSearch} action="">
        <button type="submit">
          <Search></Search>
        </button>
        <input value={locationSearch} placeholder="Search for places.." onChange={e => setLocationSearch(e.target.value)} type="text" />
      </form>
      <div className="product__SearchContainer">
        <form className="productSearch" onSubmit={handleSearch} action="">
          <input className="productSearch__input"
            value={searchInput}
            type="text"
            placeholder="Find car,mobile phone and more..."
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="searchAction">
            <Search color="#ffffff"></Search>
          </button>
        </form>
      </div>
      <div className="language">
        <span> ENGLISH </span>
        <Arrow></Arrow>
      </div>
      {
        user &&
        <>
            <img src="https://cdn3d.iconscout.com/3d/free/thumb/free-adobe-illustrator-3d-icon-download-in-png-blend-fbx-gltf-file-formats--logo-photoshop-ai-creative-software-app-pack-appliances-icons-9395200.png?f=webp"   height="36px"
  width="36px" alt="Notification" className="header__notification" />
<img 
  src="https://static.vecteezy.com/system/resources/previews/028/726/702/non_2x/3d-rendering-of-speech-bubble-icons-3d-chat-icon-set-set-of-3d-speak-bubble-chatting-box-message-box-chat-icon-set-balloon-3d-style-free-png.png" 
  alt="Chat" 
  height="36px"
  width="36px"
  className="chat-icon" 
  onClick={() => history.push('/chat/chatid')} 
/>
        </>
      }
      <div className="userSection">
        {user ?
          <Menu user={user} />
          :
          <div className="userLogin__btn" onClick={handleLogin}>Login</div>
        }
      </div>
      <div className={loginPopOn ? "login__popup" : "login__popupdisabled"}>
        <Login loginPopOn={loginPopOn} setLoginPopOn={setLoginPopOn} />
      </div>
      <div className="header__sellBtn" >
      
        <div className="sellMenuContent" onClick={handleSellClick}>
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/upload-botton-3d-icon-download-in-png-blend-fbx-gltf-file-formats--button-uploading-pack-user-interface-icons-8093484.png"   alt="Sell Icon" className="sellIcon" />
      
        </div>
      </div>
    </div>
  );
}

export default Header;