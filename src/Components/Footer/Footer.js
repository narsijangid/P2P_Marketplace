import React from 'react';

import './Footer.css';

function Footer() {

  const handleClick = () => {
    window.location.href = "https://about.free4talk.xyz/";
  };

  const  handleClickdisclaimer = () => {
    window.location.href = "https://about.free4talk.xyz/#disclaimer";
  };

  const  handleClickHelp = () => {
    window.location.href = "https://about.free4talk.xyz/#help";
  };

  const  handleClickprivacy = () => {
    window.location.href = "https://about.free4talk.xyz/#privacy";
  };


  const  handleClickcontact = () => {
    window.location.href = "https://about.free4talk.xyz/#contact";
  };

  return (
    <div className="footerParentDiv">
      <div className="footer__banner">
        <img height={200} src="https://png.pngtree.com/png-vector/20230724/ourmid/pngtree-buy-sell-button-with-arrow-icon-vector-png-image_8581738.png" alt="" />
        <div className="footerBanner__content">
          <h3>TRY THE Dazzlone APP</h3>
          <span>
            Buy, sell and find just about anything using the app on your mobile.
          </span>
        </div>
        <div className="footerBanner__links">
          <span>GET YOUR APP TODAY</span>
          <div className="footerBanner__apps">
            <img src="https://statics.olx.in/external/base/img/appstore_2x.webp" alt="img" />
            <img src="https://statics.olx.in/external/base/img/playstore_2x.webp" alt="img" />
          </div>
        </div>
      </div>
      <div className="content">
        <div className="footer__cards">
          <span className="heading">POPULAR LOCATIONS</span>
          <span>Jaipur</span>
          <span>Mumbai</span>
          <span>Chennai</span>
          <span>Pune</span>
        </div>
        <div className="footer__cards" >
          <span className="heading">TRENDING LOCATIONS</span>
          <span>Bhubaneshwar</span>
          <span>Hyderabad</span>
          <span>Chandigarh</span>
          <span>Nashik</span>
        </div>
        <div className="footer__cards">
          <span className="heading">ABOUT US</span>
          <span onClick={handleClick} >
          About Dazzlone
    </span>
    
          <span onClick={handleClickcontact}>Contact Us</span>
        </div>
        <div className="footer__cards">
          <span className="heading">Dazzlone</span>
          <span onClick={handleClickHelp}>Help</span>
          <span onClick={handleClickdisclaimer}>Disclaimer</span>
          <span onClick={handleClickprivacy}>Legal & Privacy information</span>
        </div>
        <div className="footer__cards footer__social">
          <div>
            <span className="heading">FOLLOW US</span>
            <div className="footerSocial__icons">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-twitter"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>
          <div className="footer__apps">
            <img src="https://statics.olx.in/external/base/img/appstore_2x.webp" alt="img" />
            <img src="https://statics.olx.in/external/base/img/playstore_2x.webp" alt="img" />
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Free Classifieds in India. © 2025 Dazzlone</p>
      </div>
    </div>
  );
}

export default Footer;
