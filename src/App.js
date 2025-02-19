import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Pages/Home';
import Create from './Pages/Create';
import ProductPage from './Pages/ProductPage';
import MyAdsPage from './Pages/MyAdsPage';
import SearchPage from './Pages/SearchPage';
import PageNotFound from './Pages/PageNotFound';
import ChatPage from './Pages/ChatPage';
import MyProfilePage from './Pages/MyProfilePage';
import EditPage from './Pages/EditPage';
import SellerProfile from './Pages/SellerProfile';
import EditPostPage from './Pages/EditPostPage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds splash duration
  }, []);

  return (
    <div>
      {loading ? (
        <div className="splash-screen">
          <img src="https://imagizer.imageshack.com/img922/3706/Q1vJOp.png" alt="Splash Logo" className="splash-logo" />
        </div>
      ) : (
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path="/create" component={Create} />
            <Route path="/item/:productId" component={ProductPage} />
            <Route path="/search/:searchId" component={SearchPage} />
            <Route path='/myads' component={MyAdsPage} />
            <Route path='/myfavorites' component={MyAdsPage} />
            <Route path='/chat/:chatId' component={ChatPage} />
            <Route path='/myprofile' component={MyProfilePage} />
            <Route path='/editprofile/:editInfo' component={EditPage} />
            <Route path='/profile/:profileId' component={SellerProfile} />
            <Route path='/editpost/:postId' component={EditPostPage} />
            <Route component={PageNotFound} path='*' />
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;