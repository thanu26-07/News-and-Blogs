import React, { useState, useEffect } from "react";
import "./Blogs.css";
import noImg from "../asserts/images/no-img.png";

function Blogs({ onCreateBlog, onShowNews, editPost, isEditing }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (isEditing && editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
      setImage(editPost.image || "");
    }
  }, [editPost, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill all fields");

    const blogData = { title, content, image };
    await onCreateBlog(blogData, isEditing, editPost?.id);

    // Reset form and go back
    setTitle("");
    setContent("");
    setImage("");
    onShowNews();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="blogs-container">
      <button className="back-btn" onClick={onShowNews}>
        ← Back to News
      </button>

      <div className="blogs-box">
        <div className="blogs-left">
          <img src={noImg} alt="User" />
        </div>

        <div className="blogs-right">
          <form className="blogs-right-form visible" onSubmit={handleSubmit}>
            <h2>{isEditing ? "Edit Blog" : "Create Blog"}</h2>

            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Enter Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
            />

            <div className="file-upload">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {image && <img src={image} alt="Preview" className="preview-image" />}
            </div>

            <button type="submit" className="post-btn">
              {isEditing ? "Update Blog" : "Submit Blog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Blogs;
