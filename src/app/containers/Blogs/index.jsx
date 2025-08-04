import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../../store/blogs/blogsSlice";
import AlertModal from '../../components/AlertModal';

const styles = {
  Screen: {
    background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "800px",
    marginBottom: "40px",
  },
  Header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  Title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
  },
  SignOutButton: {
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  Input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    outline: "none",
  },
  Button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#5ac8fa",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
  },
  BlogList: {
    width: "100%",
    maxWidth: "800px",
  },
  BlogItem: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
  },
  BlogTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#333",
  },
  BlogContent: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.6",
  },
};

const Blogs = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogsSlice.blogs || []);

  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });

  const handleSignOut = () => {
    history.push("/");
  };

  const handlePost = () => {
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      setAlertInfo({ title: 'Blog Post', message: 'Blog title and content cannot be empty.' });
      return;
    }

    const newBlog = {
      id: Date.now(),
      title: newBlogTitle,
      content: newBlogContent,
    };

    dispatch(addBlog(newBlog));
    setNewBlogTitle("");
    setNewBlogContent("");
  };

  const handleAlertClose = () => {
    setAlertInfo({ title: '', message: '' });
  };

  return (
    <div style={styles.Screen}>
      <AlertModal
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={handleAlertClose}
      />

      <div style={styles.Card}>
        <div style={styles.Header}>
          <div style={styles.Title}>📝 BlogsPortal</div>
          <button style={styles.SignOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        <input
          style={styles.Input}
          placeholder="Blog Title"
          value={newBlogTitle}
          onChange={(e) => setNewBlogTitle(e.target.value)}
        />
        <textarea
          style={{ ...styles.Input, height: "120px", resize: "vertical" }}
          placeholder="What's on your mind?"
          value={newBlogContent}
          onChange={(e) => setNewBlogContent(e.target.value)}
        />
        <button style={styles.Button} onClick={handlePost}>Post</button>
      </div>

      <div style={styles.BlogList}>
        {blogs.map((blog) => (
          <div key={blog.id} style={styles.BlogItem}>
            <h3 style={styles.BlogTitle}>{blog.title}</h3>
            <p style={styles.BlogContent}>{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
