import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton__container">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="skeleton__card">
          <div className="skeleton__image"></div>
          <div className="skeleton__content">
            <div className="skeleton__price"></div>
            <div className="skeleton__title"></div>
            <div className="skeleton__subtitle"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader; 