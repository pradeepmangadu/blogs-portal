import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addBlog } from "../../store/blogs/blogsSlice";
import { paths } from "../../constants/paths";
import AlertModal from '../../components/AlertModal';
import { db } from "../../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

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
    backgroundColor: "#fefefe",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "800px",
    marginBottom: "40px",
  },
  Header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    gap: '20px',
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
  SearchButton: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    margin: "0 10px",
    transition: "background-color 0.3s ease",
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
    marginBottom: "10px",
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
  BlogCategory: {
    fontSize: "14px",
    fontStyle: "italic",
    color: "#777",
    marginBottom: "10px",
  },
  ActionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  smallButton: {
   padding: "6px 12px",
   backgroundColor: "#5ac8fa",
   color: "#fff",
   border: "none",
   borderRadius: "6px",
   fontSize: "12px",
   cursor: "pointer",
   fontWeight: "500",
  },
};

const Blogs = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("");
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });
  const [fetchedBlogs, setFetchedBlogs] = useState([]);

  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingCategory, setEditingCategory] = useState("");

  const handleSignOut = () => {
    history.push("/");
  };

  const handlePost = async () => {
    if (!newBlogTitle.trim() || !newBlogContent.trim() || !newBlogCategory.trim()) {
      setAlertInfo({ title: 'Blog Post', message: 'Blog title, content, and category cannot be empty.' });
      return;
    }

    const newBlog = {
      title: newBlogTitle,
      content: newBlogContent,
      category: newBlogCategory,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "blogs"), newBlog);
      dispatch(addBlog({ ...newBlog, id: Date.now() }));
      setNewBlogTitle("");
      setNewBlogContent("");
      setNewBlogCategory("");
      setAlertInfo({ title: 'Success', message: 'Blog posted successfully!' });
      fetchBlogsFromFirestore();
    } catch (error) {
      setAlertInfo({ title: 'Error', message: 'Failed to post blog. Please try again.' });
      console.error("Error adding blog to Firestore:", error);
    }
  };

  const fetchBlogsFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFetchedBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setAlertInfo({ title: 'Error', message: 'Failed to load blogs.' });
    }
  };

  const startEditing = (blog) => {
    setEditingBlogId(blog.id);
    setEditingTitle(blog.title);
    setEditingContent(blog.content);
    setEditingCategory(blog.category || "");
  };

  const updateBlog = async () => {
    if (!editingTitle.trim() || !editingContent.trim() || !editingCategory.trim()) return;

    try {
      const blogRef = doc(db, "blogs", editingBlogId);
      await updateDoc(blogRef, {
        title: editingTitle,
        content: editingContent,
        category: editingCategory,
      });
      setEditingBlogId(null);
      setEditingTitle("");
      setEditingContent("");
      setEditingCategory("");
      setAlertInfo({ title: 'Success', message: 'Blog updated successfully!' });
      fetchBlogsFromFirestore();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      setAlertInfo({ title: 'Success', message: 'Blog deleted successfully!' });
      fetchBlogsFromFirestore();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleAlertClose = () => {
    setAlertInfo({ title: '', message: '' });
  };

  useEffect(() => {
    fetchBlogsFromFirestore();
  }, []);

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
          <button style={styles.SearchButton} onClick={() => history.push(paths.SEARCH.path)}>
            Search
          </button>
          <button style={styles.SignOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        {editingBlogId ? (
          <>
            <input
              style={styles.Input}
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              placeholder="Edit Title"
            />
            <input
              style={styles.Input}
              value={editingCategory}
              onChange={(e) => setEditingCategory(e.target.value)}
              placeholder="Edit Category"
            />
            <textarea
              style={{ ...styles.Input, height: "120px", resize: "vertical" }}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="Edit Content"
            />
            <button style={styles.Button} onClick={updateBlog}>Update</button>
            <button style={styles.SignOutButton} onClick={() => setEditingBlogId(null)}>Cancel</button>
          </>
        ) : (
          <>
            <input
              style={styles.Input}
              placeholder="Blog Title"
              value={newBlogTitle}
              onChange={(e) => setNewBlogTitle(e.target.value)}
            />
            <input
              style={styles.Input}
              placeholder="Category"
              value={newBlogCategory}
              onChange={(e) => setNewBlogCategory(e.target.value)}
            />
            <textarea
              style={{ ...styles.Input, height: "120px", resize: "vertical" }}
              placeholder="What's on your mind?"
              value={newBlogContent}
              onChange={(e) => setNewBlogContent(e.target.value)}
            />
            <button style={styles.Button} onClick={handlePost}>Post</button>
          </>
        )}
      </div>

      <div style={styles.BlogList}>
        {fetchedBlogs.map((blog) => (
          <div key={blog.id} style={styles.BlogItem}>
            <h3 style={styles.BlogTitle}>{blog.title}</h3>
            <p style={styles.BlogCategory}>Category: {blog.category}</p>
            <p style={styles.BlogContent}>{blog.content}</p>
            <div style={styles.ActionButtons}>
              <button style={styles.smallButton} onClick={() => startEditing(blog)}>Edit</button>
              <button style={styles.SignOutButton} onClick={() => deleteBlog(blog.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
