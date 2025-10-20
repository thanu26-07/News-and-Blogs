// App.js
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Blogs from "./components/Blogs";
import News from "./components/News";

import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNews, setShowNews] = useState(true);
  const [showBlogs, setShowBlogs] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Monitor user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch blogs when user changes
  useEffect(() => {
    if (user) {
      fetchUserBlogs();
      fetchUserBookmarks();
    }
  }, [user]);

  // Fetch user's blogs
  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const blogsRef = collection(db, "blogs");
      const q = query(
        blogsRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's bookmarks
  const fetchUserBookmarks = async () => {
    try {
      const bookmarksRef = collection(db, "bookmarks");
      const q = query(bookmarksRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const bookmarksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookmarks(bookmarksData);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = async (article) => {
    try {
      const existing = bookmarks.find((b) => b.title === article.title);
      if (existing) {
        // Remove bookmark
        await deleteDoc(doc(db, "bookmarks", existing.id));
        setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
      } else {
        // Add new bookmark
        const docRef = await addDoc(collection(db, "bookmarks"), {
          ...article,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        setBookmarks((prev) => [...prev, { ...article, id: docRef.id }]);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      alert("Failed to toggle bookmark: " + err.message);
    }
  };

  // Create or update blog
  const handleCreateBlogs = async (newBlog, isEditing, blogId = null) => {
    try {
      if (!isEditing) {
        const docRef = await addDoc(collection(db, "blogs"), {
          ...newBlog,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        setBlogs((prev) => [...prev, { ...newBlog, id: docRef.id }]);
      } else {
        const blogRef = doc(db, "blogs", blogId);
        await updateDoc(blogRef, newBlog);
        setBlogs((prev) =>
          prev.map((b) => (b.id === blogId ? { ...b, ...newBlog } : b))
        );
      }
      setIsEditing(false);
      setSelectedPost(null);
    } catch (err) {
      console.error("Failed to save blog:", err);
      alert("Failed to save blog: " + err.message);
    }
  };

  // Edit blog
  const handleEditBlog = (blog) => {
    setSelectedPost(blog);
    setIsEditing(true);
    setShowNews(false);
    setShowBlogs(true);
  };

  // Delete blog
  const handleDeleteBlog = async (blogToDelete) => {
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete.id));
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog: " + err.message);
    }
  };

  const handleShowNews = () => {
    setShowNews(true);
    setShowBlogs(false);
    setIsEditing(false);
    setSelectedPost(null);
  };

  const handleShowBlogs = async () => {
    setShowBlogs(true);
    setShowNews(false);
    if (user) await fetchUserBlogs();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setBlogs([]);
    setBookmarks([]);
    setShowNews(true);
    setShowBlogs(false);
    setUser(null);
  };

  if (!user) return <Login onLoginSuccess={() => setUser(auth.currentUser)} />;

  if (loading) return <p>Loading your data...</p>;

  return (
    <div className="container">
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleLogout}>Logout</button>

      <div className="news-blog-app">
        {showNews && (
          <News
            onShowBlogs={handleShowBlogs}
            blogs={blogs}
            onEditBlog={handleEditBlog}
            onDeleteBlog={handleDeleteBlog}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        {showBlogs && (
          <Blogs
            onShowNews={handleShowNews}
            onCreateBlog={handleCreateBlogs}
            editPost={selectedPost}
            isEditing={isEditing}
          />
        )}
      </div>
    </div>
  );
}

export default App;
