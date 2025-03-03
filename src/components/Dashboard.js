// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubmittedArticles } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await getSubmittedArticles();
        console.log("Full API response:", response);
        
        let data = response.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            console.error("Error parsing response data:", parseError);
            data = [];
          }
        }
        if (Array.isArray(data)) {
          // Sort the articles by createdAt in descending order (latest first)
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setArticles(data);
        } else {
          console.error("Expected an array but received:", data);
          setArticles([]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    fetchArticles();
  }, []);

  // Build a list of unique categories from articles.
  // If an article doesn't have a valid category, we label it as "Uncategorized".
  const categories = Array.from(
    new Set(
      articles.map(article => 
        article.category && article.category.trim() !== "" 
          ? article.category 
          : "Uncategorized"
      )
    )
  );

  // Filter articles based on the selected category.
  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(article => {
        const category = article.category && article.category.trim() !== "" 
          ? article.category 
          : "Uncategorized";
        return category === selectedCategory;
      });

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Submitted Articles</h2>
      <div className="category-selector">
        <label htmlFor="category-select">Filter by Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {filteredArticles.length > 0 ? (
        <ul className="articles-list">
          {filteredArticles.map(article => (
            <li key={article.id} className="article-item">
              <Link to={`/articles/${article.id}`} className="article-link">
                <div className="article-content">
                  <h3 className="article-title">
                    {article.title || "No Title"}
                  </h3>
                  <span className="article-category">
                    {article.category && article.category.trim() !== ""
                      ? article.category
                      : "Uncategorized"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-articles">No submitted articles found.</p>
      )}
    </div>
  );
}
