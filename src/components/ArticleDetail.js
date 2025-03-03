// ArticleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById, approveArticle, rejectArticle } from '../services/api';
import './ArticleDetail.css';
import AuthorCard from './AuthorCard'; // Import the AuthorCard component

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [contentElements, setContentElements] = useState([]);
  const [comment, setComment] = useState('');
  const [showAuthorCard, setShowAuthorCard] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticleById(id);
        setArticle(data);
        // Parse the JSON string in article.content
        if (data && data.content) {
          try {
            const elements = JSON.parse(data.content);
            setContentElements(elements);
          } catch (err) {
            console.error("Error parsing article content:", err);
            setContentElements([]);
          }
        }
      } catch (error) {
        alert("Error fetching article: " + error.message);
      }
    }
    fetchArticle();
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveArticle(id);
      alert("Article approved successfully!");
      navigate('/dashboard');
    } catch (error) {
      alert("Error approving article: " + error.message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectArticle(id, comment);
      alert("Article rejected successfully!");
      navigate('/dashboard');
    } catch (error) {
      alert("Error rejecting article: " + error.message);
    }
  };

  if (!article) return <p className="loading">Loading article...</p>;

  // Determine display name (using the email's local-part if name is not provided)
  const authorDisplayName = article.author
    ? (article.author.name || article.author.email.split('@')[0])
    : "Unknown";

  return (
    <div className="article-detail-container">
      <article className="article-wrapper">
        {/* Title, Category, and Author */}
        <header className="article-header">
          <h1 className="article-title">{article.title || "No Title"}</h1>
          <p className="article-category">
            <strong>Category:</strong>{" "}
            {article.category && article.category.trim() !== ""
              ? article.category
              : "Uncategorized"}
          </p>
          <p className="article-author">
            <strong>Author:</strong>{" "}
            <span className="clickable-author" onClick={() => setShowAuthorCard(true)}>
              {authorDisplayName}
            </span>
          </p>
        </header>

        {/* Main Article Content */}
        <section className="article-content">
          {contentElements.length > 0 ? (
            contentElements.map((element, index) => {
              switch (element.type) {
                case "HEADING":
                  return (
                    <h2 key={index} className="content-heading">
                      {element.content}
                    </h2>
                  );
                case "SUBHEADING":
                  return (
                    <h3 key={index} className="content-subheading">
                      {element.content}
                    </h3>
                  );
                case "PARAGRAPH":
                  return (
                    <p key={index} className="content-paragraph">
                      {element.content}
                    </p>
                  );
                case "QUOTE":
                  return (
                    <blockquote key={index} className="content-quote">
                      {element.content}
                    </blockquote>
                  );
                case "IMAGE":
                  return (
                    <figure key={index} className="content-figure">
                      <img
                        className="content-image"
                        src={element.content}
                        alt="Article Visual"
                      />
                    </figure>
                  );
                default:
                  return (
                    <p key={index} className="content-paragraph">
                      {element.content}
                    </p>
                  );
              }
            })
          ) : (
            <p>No content available.</p>
          )}
        </section>

        {/* Approve / Reject Actions */}
        <section className="review-section">
          <h3 className="review-title">Review Actions</h3>
          <textarea
            placeholder="Rejection comment (if rejecting)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="reject-textarea"
          />
          <div className="buttons-row">
            <button className="approve-button" onClick={handleApprove}>
              Approve
            </button>
            <button className="reject-button" onClick={handleReject}>
              Reject
            </button>
          </div>
        </section>
      </article>

      {/* Conditionally render the AuthorCard */}
      {showAuthorCard && article.author && (
        <AuthorCard author={article.author} onClose={() => setShowAuthorCard(false)} />
      )}
    </div>
  );
}
