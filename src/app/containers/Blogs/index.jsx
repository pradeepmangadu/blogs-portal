import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../../store/blogs/blogsSlice";
import AlertModal from '../../components/AlertModal';

const styles = {
  Screen: {
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5vh 20px",
    boxSizing: "border-box",
  },
  Text: {
    fontSize: "24px",
    fontFamily: "Roboto Mono",
    letterSpacing: "-0.6px",
    lineHeight: "32px",
  },
  header: {
    width: "100%",
    maxWidth: "1100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  postContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px",
    marginBottom: "40px",
  },
  titleInput: {
    width: "100%",
    height: "50px",
    padding: "10px",
    border: "1px solid #030303",
    boxSizing: "border-box",
    borderRadius: "2px",
    backgroundColor: "#e6e6e6",
    color: "#030303",
    fontSize: "16px",
    fontFamily: "Roboto Mono",
    lineHeight: "1.5",
    outline: "none",
    marginBottom: "10px",
  },
  contentInput: {
    width: "100%",
    height: "150px",
    padding: "10px",
    border: "1px solid #030303",
    boxSizing: "border-box",
    borderRadius: "2px",
    backgroundColor: "#e6e6e6",
    color: "#030303",
    fontSize: "14px",
    fontFamily: "Roboto Mono",
    lineHeight: "1.5",
    outline: "none",
    resize: "vertical",
    marginBottom: "20px",
  },
  Button: {
    cursor: "pointer",
    width: "320px",
    height: "60px",
    padding: "0px 8px",
    border: "1px solid #030303",
    boxSizing: "border-box",
    boxShadow: "2px 2px 0px rgba(0,0,0,0.8)",
    backgroundColor: "#5ac8fa",
    color: "#030303",
    fontSize: "14px",
    fontFamily: "Roboto Mono",
    lineHeight: "20px",
    textTransform: "uppercase",
    outline: "none",
  },
  signOutButton: {
    cursor: "pointer",
    padding: "10px 20px",
    border: "1px solid #030303",
    boxSizing: "border-box",
    boxShadow: "2px 2px 0px rgba(0,0,0,0.8)",
    backgroundColor: "#ff6b6b",
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "Roboto Mono",
    lineHeight: "20px",
    textTransform: "uppercase",
    outline: "none",
    height: "fit-content",
  },
  blogListContainer: {
    marginTop: "50px",
    width: "100%",
    maxWidth: "800px",
  },
  blogItem: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    textAlign: "left",
  },
  blogTitle: {
    fontFamily: "Roboto Mono, monospace",
    color: "#333",
    margin: "0 0 10px 0",
    fontSize: "20px",
  },
  blogContent: {
    fontFamily: "Roboto Mono, monospace",
    color: "#666",
    lineHeight: "1.6",
    margin: "0",
    fontSize: "14px",
  },
};

const Blogs = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    history.push("/");
  };

  const blogs = useSelector((state) => state.blogsSlice.blogs || []);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });

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
      <div style={styles.header}>
        <div style={styles.Text}>BlogsPortal</div>
        <button style={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      <div style={styles.postContainer}>
        <input
          style={styles.titleInput}
          placeholder={"Blog Title"}
          value={newBlogTitle}
          onChange={(e) => setNewBlogTitle(e.target.value)}
        />
        <textarea
          style={styles.contentInput}
          placeholder={"What's on your mind?"}
          value={newBlogContent}
          onChange={(e) => setNewBlogContent(e.target.value)}
        />
        <button style={styles.Button} onClick={handlePost}>Post</button>
      </div>

      <div style={styles.blogListContainer}>
        {blogs.map((blog) => (
          <div key={blog.id} style={styles.blogItem}>
            <h3 style={styles.blogTitle}>{blog.title}</h3>
            <p style={styles.blogContent}>{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
