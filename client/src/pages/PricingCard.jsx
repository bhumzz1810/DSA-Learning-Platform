import React from 'react';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, features, ctaText, featured = false }) => {
  return (
    <div className={`pricing-card ${featured ? 'featured' : ''}`}>
      <div className="pricing-header">
        <h3>{title}</h3>
        <div className="price">
          <span className="currency">$</span>
          <span className="amount">{price}</span>
          <span className="period">/month</span>
        </div>
      </div>
      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <Link to="/signup" className={`btn ${featured ? 'primary-btn' : 'secondary-btn'}`}>
        {ctaText}
      </Link>
    </div>
  );
};

export default PricingCard;