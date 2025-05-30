import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import Chat from './Components/Chat/Chat';

// ✅ Lazy Loading Components
const Home = lazy(() => import('./Pages/Home'));
const Create = lazy(() => import('./Pages/Create'));
const ProductPage = lazy(() => import('./Pages/ProductPage'));
const MyAdsPage = lazy(() => import('./Pages/MyAdsPage'));
const SearchPage = lazy(() => import('./Pages/SearchPage'));
const PageNotFound = lazy(() => import('./Pages/PageNotFound'));
const MyProfilePage = lazy(() => import('./Pages/MyProfilePage'));
const EditPage = lazy(() => import('./Pages/EditPage'));
const SellerProfile = lazy(() => import('./Pages/SellerProfile'));
const EditPostPage = lazy(() => import('./Pages/EditPostPage'));

// ✅ Preload Important Pages
const preloadRoutes = () => {
  import('./Pages/Home');
  import('./Pages/Create');
  import('./Pages/ProductPage');
};
preloadRoutes();

// ✅ Back Button Handling
const BackButtonHandler = () => {
  const history = useHistory();

  useEffect(() => {
    // ✅ Custom history entry add kar raha hu taki WebView ka back button kaam kare
    window.history.pushState(null, '', window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();

      if (window.location.pathname !== '/') {
        history.goBack(); // ✅ Pichle page par wapas jane ka function
      } else {
        window.ReactNativeWebView?.postMessage('EXIT_APP'); // ✅ WebView ko exit ka signal bhejna
      }
    };

    window.onpopstate = handleBackButton;
    return () => {
      window.onpopstate = null; // Cleanup effect
    };
  }, [history]);

  return null;
};

function App() {
  return (
    <div>
      <Router>
        <BackButtonHandler />
        <Suspense fallback={<div className="loading">.</div>}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/chat/:chatId?">
              <Chat />
            </Route>
            <Route exact path="/create" component={Create} />
            <Route path="/item/:productId" component={ProductPage} />
            <Route path="/search/:searchId" component={SearchPage} />
            <Route path="/myads" component={MyAdsPage} />
            <Route path="/myfavorites" component={MyAdsPage} />
            <Route path="/myprofile" component={MyProfilePage} />
            <Route path="/editprofile/:editInfo" component={EditPage} />
            <Route path="/profile/:profileId" component={SellerProfile} />
            <Route path="/editpost/:postId" component={EditPostPage} />
            <Route component={PageNotFound} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;




// $env:NODE_OPTIONS="--openssl-legacy-provider"