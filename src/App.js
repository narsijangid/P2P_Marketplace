import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';

// ✅ Lazy Loading Components for Faster Load Time
const Home = lazy(() => import('./Pages/Home'));
const Create = lazy(() => import('./Pages/Create'));
const ProductPage = lazy(() => import('./Pages/ProductPage'));
const MyAdsPage = lazy(() => import('./Pages/MyAdsPage'));
const SearchPage = lazy(() => import('./Pages/SearchPage'));
const PageNotFound = lazy(() => import('./Pages/PageNotFound'));
const ChatPage = lazy(() => import('./Pages/ChatPage'));
const MyProfilePage = lazy(() => import('./Pages/MyProfilePage'));
const EditPage = lazy(() => import('./Pages/EditPage'));
const SellerProfile = lazy(() => import('./Pages/SellerProfile'));
const EditPostPage = lazy(() => import('./Pages/EditPostPage'));

// ✅ Preloading pages in advance for faster navigation
const preloadRoutes = () => {
  import('./Pages/Home');
  import('./Pages/Create');
  import('./Pages/ProductPage');
};

// Call preload on initial load
preloadRoutes();

// ✅ Back Button Handling for WebView
const BackButtonHandler = () => {
  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      if (window.history.length > 1) {
        history.goBack(); // React Router ka use karke back navigation
      } else {
        window.ReactNativeWebView?.postMessage('EXIT_APP'); // WebView se exit request bhejna
      }
    };

    window.onpopstate = handleBackButton;
    return () => {
      window.onpopstate = null; // Cleanup when component unmounts
    };
  }, [history]);

  return null;
};

function App() {
  return (
    <div>
      <Router>
        <BackButtonHandler /> {/* WebView ke liye back button support */}
        <Suspense fallback={<div className="loading">.</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/create" component={Create} />
            <Route path="/item/:productId" component={ProductPage} />
            <Route path="/search/:searchId" component={SearchPage} />
            <Route path="/myads" component={MyAdsPage} />
            <Route path="/myfavorites" component={MyAdsPage} />
            <Route path="/chat/:chatId" component={ChatPage} />
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
