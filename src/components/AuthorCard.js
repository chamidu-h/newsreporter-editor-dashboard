// AuthorCard.js
import React from 'react';
import './AuthorCard.css'; // Create this CSS file for styling if needed

const AuthorCard = ({ author, onClose }) => {
  // Use the provided name if available; otherwise extract the local-part from the email
  const displayName = author.name || author.email.split('@')[0];

  return (
    <div className="author-card-overlay" onClick={onClose}>
      <div className="author-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="author-profile-picture"
        />
        <h2>{displayName}</h2>
        <p>Email: {author.email}</p>
        <p>Brief Intro: This is a demo introduction about the reporter. More details can be added here.</p>
      </div>
    </div>
  );
};

export default AuthorCard;
