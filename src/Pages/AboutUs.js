import React from 'react';
import './AboutUs.css'; // Create this CSS file for styling

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Header */}
      <header className="header">
        <div className="logo">Dazzlone</div>
      </header>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h1>About Dazzlone</h1>
          <p>
            Welcome to <strong>Dazzlone</strong>, the ultimate platform for buying and selling digital products securely and efficiently. Launched by <strong>Free4talk Company</strong>, Dazzlone is designed to empower individuals and businesses to connect, trade, and grow in the digital economy. Our mission is to provide a trusted, user-friendly marketplace where users can seamlessly exchange digital goods with confidence.
          </p>
          <p>
            At Dazzlone, we understand the importance of security and convenience in today's fast-paced digital world. That's why we've built a platform that combines cutting-edge technology with a simple, intuitive interface. Whether you're a creator looking to sell your digital products or a buyer searching for high-quality items, Dazzlone is here to make the process smooth and hassle-free.
          </p>
          <p>
            Our platform supports a wide range of digital products, including e-books, software, templates, music, and more. With <strong>100% secure peer-to-peer transactions</strong>, advanced encryption, and a global network of users, Dazzlone is redefining the way people buy and sell digital goods.
          </p>
          <p>
            Join the Dazzlone community today and experience the future of digital commerce. Together, let's create a world where everyone can thrive in the digital economy.
          </p>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What is Dazzlone?</h3>
              <p>
                Dazzlone is a secure platform for buying and selling digital products. It connects buyers and sellers in a peer-to-peer marketplace, ensuring safe and efficient transactions.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is Dazzlone free to use?</h3>
              <p>
                Yes, Dazzlone is completely free to join and use. You can create an account, list your products, and start trading without any hidden fees.
              </p>
            </div>
            <div className="faq-item">
              <h3>How secure are transactions on Dazzlone?</h3>
              <p>
                All transactions on Dazzlone are 100% secure. We use advanced encryption and security protocols to protect your data and ensure safe peer-to-peer transactions.
              </p>
            </div>
            <div className="faq-item">
              <h3>What types of digital products can I sell on Dazzlone?</h3>
              <p>
                You can sell a wide range of digital products, including e-books, software, music, templates, graphics, and more. If it's digital, you can sell it on Dazzlone!
              </p>
            </div>
            <div className="faq-item">
              <h3>How do I get started on Dazzlone?</h3>
              <p>
                Getting started is easy! Simply create an account, list your products, and start connecting with buyers. Our user-friendly interface makes the process quick and straightforward.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I use Dazzlone globally?</h3>
              <p>
                Yes, Dazzlone is available to users worldwide. Whether you're a buyer or a seller, you can connect with people from all over the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 Dazzlone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;