import React, { useEffect, useState } from "react";
import Weather from "./Weather";
import Calender from "./Calender";
import "./News.css";
import noImg from "../asserts/images/no-img.png";
import NewsModel from "./NewsModel";
import Bookmark from "./Bookmark";
import BoxModel from "./BoxModel";

const News = ({ onShowBlogs, blogs, onEditBlog, onDeleteBlog }) => {
  const [heading, setHeading] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarksModel, setShowBookmarksModel] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModelBox, setShowModelBox] = useState(false);

  const categories = [
    "general",
    "world",
    "business",
    "technology",
    "entertainment",
    "sports",
    "science",
    "health",
    "nation",
  ];

  // Fetch news from GNews API
  const fetchNews = async () => {
    try {
      const url = searchQuery
        ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            searchQuery
          )}&lang=en&apikey=5631f99e5d316c0bf88add7c8e2f7cca`
        : `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=5631f99e5d316c0bf88add7c8e2f7cca`;

      const res = await fetch(url);
      const data = await res.json();
      console.log("News API Response:", data);

      if (data.articles && data.articles.length > 0) {
        setHeading(data.articles[0]);
        setNews(data.articles.slice(1, 7));
      } else {
        setHeading(null);
        setNews([]);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (e, cat) => {
    e.preventDefault();
    setSelectedCategory(cat);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSearchInput("");
  };

  const handleArticle = (article) => {
    setSelectedArticle(article);
    setShowModel(true);
  };

  const handleBookmark = (article) => {
    setBookmarks((prevBookmarks) => {
      const isBookmarked = prevBookmarks.some(
        (bookmark) => bookmark.title === article.title
      );
      if (isBookmarked) {
        return prevBookmarks.filter((bookmark) => bookmark.title !== article.title);
      } else {
        return [...prevBookmarks, article];
      }
    });
  };

  const handleBlogClick = (blog) => {
    setSelectedPost(blog);
    setShowModelBox(true);
  };

  const closeBlogModel = () => {
    setSelectedPost(null);
    setShowModelBox(false);
  };

  return (
    <>
      <div className="news">
        <header className="news-header">
          <h1 className="logo">News & Blogs</h1>
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search News..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </header>

        <div className="news-content">
          {/* Sidebar */}
          <div className="navbar">
            <div className="user" onClick={onShowBlogs}>
              <p>MY Blog</p>
            </div>
            <nav className="categories">
              <h1 className="nav-heading">Categories</h1>
              <nav className="nav-links">
                {categories.map((category) => (
                  <a
                    href="#"
                    className="nav-link"
                    key={category}
                    onClick={(e) => handleCategoryClick(e, category)}
                  >
                    {category}
                  </a>
                ))}
                <a
                  href="#"
                  className="nav-link"
                  onClick={() => setShowBookmarksModel(true)}
                >
                  Bookmarks <i className="fa-solid fa-bookmark"></i>
                </a>
              </nav>
            </nav>
          </div>

          {/* News Section */}
          <div className="news-section">
            {heading && (
              <div className="headline" onClick={() => handleArticle(heading)}>
                <img src={heading.image || noImg} alt={heading.title || "News"} />
                <h2 className="headline-title">
                  {heading.title}
                  <i
                    className={`${
                      bookmarks.some((bookmark) => bookmark.title === heading.title)
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-bookmark bookmark`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(heading);
                    }}
                  ></i>
                </h2>
              </div>
            )}

            <div className="news-grid">
              {news.map((article, index) => (
                <div
                  key={index}
                  className="news-grid-item"
                  onClick={() => handleArticle(article)}
                >
                  <img
                    src={article.image || noImg}
                    alt={article.title || "News"}
                    onError={(e) => (e.target.src = noImg)}
                  />
                  <h3>
                    {article.title.length > 25
                      ? `${article.title.slice(0, 25)}...`
                      : article.title}
                    <i
                      className={`${
                        bookmarks.some((bookmark) => bookmark.title === article.title)
                          ? "fa-solid"
                          : "fa-regular"
                      } fa-bookmark bookmark`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(article);
                      }}
                    ></i>
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Modals */}
          <NewsModel
            show={showModel}
            article={selectedArticle}
            onClose={() => setShowModel(false)}
          />
          <Bookmark
            show={showBookmarksModel}
            bookmarks={bookmarks}
            onClose={() => setShowBookmarksModel(false)}
            onSelectArticle={handleArticle}
            onDeleteBookmark={handleBookmark}
          />

          {/* Blogs Section */}
          <div className="my-blogs">
            <h1 className="my-blog-heading">My Blogs</h1>
            <div className="blog-posts">
              {blogs.map((blog, index) => (
                <div
                  key={index}
                  className="blog-post"
                  onClick={() => handleBlogClick(blog)}
                >
                  <img src={blog.image || noImg} alt={blog.title} />
                  <h3>{blog.title}</h3>
                  <div className="post-buttons">
                    <button className="edit-button" onClick={() => onEditBlog(blog)}>
                      <i className="bx bxs-edit"></i>
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlog(blog);
                      }}
                    >
                      <i className="bx bxs-x-circle"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedPost && showModelBox && (
              <BoxModel
                show={showModelBox}
                blog={selectedPost}
                onClose={closeBlogModel}
              />
            )}
          </div>

          <div className="weather-calender">
            <Weather />
            <Calender />
          </div>
        </div>

        <footer className="news-footer">
          <p>
            <span>News & Blogs App</span>
          </p>
          <p>&copy; All Rights Reserved</p>
        </footer>
      </div>
    </>
  );
};

export default News;
