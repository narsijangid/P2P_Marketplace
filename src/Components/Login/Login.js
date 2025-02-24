import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import db, { auth } from '../../firebase';
import './Login.css';

function Login({ setLoginPopOn }) {
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const phoneRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isSignUp) {
        // Login
        await auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
        setLoginPopOn(false);
      } else {
        // Sign Up
        const result = await auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
        await result.user.updateProfile({ displayName: usernameRef.current.value });
        await db.doc(`/users/${result.user.uid}`).set({
          id: result.user.uid,
          username: usernameRef.current.value,
          phone: phoneRef.current.value,
          createdAt: new Date(),
          about: null,
          photourl: 'https://cdn-icons-png.flaticon.com/512/18388/18388709.png',
        });
        setLoginPopOn(false);
        setIsSignUp(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const navigateBack = () => {
    if (isSignUp) {
      setIsSignUp(false);
    } else {
      setLoginPopOn(false);
      history.push('/');
    }
  };

  const closeLogin = () => {
    setLoginPopOn(false);
    setIsSignUp(false);
    history.push('/');
  };

  const popUpRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setLoginPopOn(false);
        setIsSignUp(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setLoginPopOn]);

  return (
    <div className="login">
      <div ref={popUpRef} className="login__contents">
        <div className="login__header">
          <div onClick={navigateBack} className="back__icon">
            <i className="bi bi-arrow-left"></i>
          </div>
          <div onClick={closeLogin} className="close__icon">
            <i className="bi bi-x-lg"></i>
          </div>
        </div>
        <img
          onClick={() => history.push('/')}
          className="login__logo"
          src="./dazuuu.jpg"
          alt="Logo"
        />
        <h3>{isSignUp ? 'Sign Up' : 'Login'}</h3>
        {error && <p className="login__error">!!! {error}</p>}
        <form className="login__form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            ref={emailRef}
            placeholder="Enter email"
            required
          />
          <input
            className="input"
            type="password"
            ref={passwordRef}
            placeholder="Password"
            required
          />
          {isSignUp && (
            <>
              <input
                className="input"
                type="text"
                ref={usernameRef}
                placeholder="Enter name"
                required
              />
              <input
                className="input"
                type="tel"
                ref={phoneRef}
                placeholder="Enter mobile no."
                required
              />
            </>
          )}
          <button type="submit" className="login__button">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="signup__button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already a user? Login' : 'New to Dazzlone? Sign Up'}
        </p>
      </div>
    </div>
  );
}

export default Login;