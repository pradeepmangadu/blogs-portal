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
import SearchIcon from '@mui/icons-material/Search';
import PostAddIcon from '@mui/icons-material/PostAdd';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  BlogList: {
    overflow: 'scroll', // or 'hidden', 'auto', 'visible'
    height: '600px',
  },
  BlogItem: {
    backgroundColor: "#fefefe",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "800px",
    marginBottom: "40px",
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
  const [author, setAuthor] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    history.push("/");
  };

  useEffect(() => {
    const email = localStorage.getItem('authorEmail');
      if (email) {
          setAuthor(email.toLowerCase()); // Normalize email
      }
  }, []);

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 30, height: 30,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ').length > 1 ? name.split(' ')[1][0] : ''}`,
    };
  }

  const handlePost = async () => {
    if (!newBlogTitle.trim() || !newBlogContent.trim() || !newBlogCategory.trim()) {
      setAlertInfo({ title: 'Blog Post', message: 'Blog title, content, and category cannot be empty.' });
      return;
    }

    const newBlog = {
      author: author,
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
        author: author,
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
          <div>
              <Button variant="contained" color="success" startIcon={<SearchIcon />} onClick={() => history.push(paths.SEARCH.path)}>
                Search
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar {...stringAvatar(author.toUpperCase())} />
              </IconButton>
               <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>{author.toUpperCase()}</MenuItem>
                <MenuItem onClick={handleSignOut}>Log out</MenuItem>
              </Menu>
          </div>
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
            <Button variant="contained" endIcon={<EditIcon />} onClick={updateBlog}>Update</Button> <span/>
            <Button variant="contained" color="error" onClick={() => setEditingBlogId(null)}>Cancel</Button>
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
            <Button variant="contained" endIcon={<PostAddIcon />} onClick={handlePost}>Post</Button>
          </>
        )}
      </div>

      {fetchedBlogs.length > 0 && (
        <>
          <h4>Recent Blogs: </h4>
          <div style={styles.BlogList}>
            {fetchedBlogs.map((blog) => (
              <div key={blog.id} style={styles.BlogItem}>
                <h3 style={styles.BlogTitle}>{blog.title}</h3>
                <p style={styles.BlogCategory}>Category: {blog.category}</p>
                <p style={styles.BlogContent}>{blog.content}</p>
                <div style={styles.ActionButtons}>
                  <Button variant="contained" endIcon={<EditIcon />} onClick={() => startEditing(blog)}>Edit</Button>
                  <Button variant="contained" endIcon={<DeleteIcon />} color="error" onClick={() => deleteBlog(blog.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Blogs;
