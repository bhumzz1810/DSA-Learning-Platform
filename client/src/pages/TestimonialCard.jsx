import React from 'react';
import StarRating from './StarRating';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="testimonial-card">
      <StarRating rating={testimonial.rating} />
      <p className="testimonial-content">"{testimonial.content}"</p>
      <div className="testimonial-author">
        <h4>{testimonial.name}</h4>
        <p>{testimonial.role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;