import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AlertModal from "../../../components/AlertModal";
import { paths } from "../../../constants/paths";
import { db } from '../../../firebase-config';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";

const styles = {
    Screen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        minHeight: '100vh',
        position: 'relative',
        fontFamily: 'Poppins, sans-serif',
    },
    SearchContainer: {
        display: "flex",
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
    },
    SearchInput: {
        padding: "10px",
        margin: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        width: '300px',
        fontSize: '16px',
    },
    SearchButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        margin: "10px",
    },
    SearchResults: {
        width: "80%",
        marginTop: "100px",
    },
    table: {
        borderCollapse: 'collapse',
        width: '100%',
    },
    th: {
        backgroundColor: '#f2f2f2',
        padding: '8px',
        border: '1px solid #ddd',
    },
    td: {
        padding: '8px',
        border: '1px solid #ddd',
        textAlign: 'left',
    },
    viewButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        padding: '0'
    },
    modalMessageContent: {
        maxHeight: '60vh',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
    },
};

const Search = () => {
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showContentModal, setShowContentModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });
    const history = useHistory();

    useEffect(() => {
        const email = localStorage.getItem('authorEmail');
        if (email) {
            setAuthor(email.toLowerCase()); // Normalize email
        }
    }, []);

    const handleViewContent = (blog) => {
        setModalContent({ title: blog.title, content: blog.content });
        setShowContentModal(true);
    };

    const handleCloseModal = () => {
        setShowContentModal(false);
        setModalContent({ title: '', content: '' });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const blogsCollection = collection(db, 'blogs');
            const blogsSnapshot = await getDocs(blogsCollection);
            const blogsList = blogsSnapshot.docs.map(doc => doc.data());
            const uniqueCategories = [...new Set(blogsList.map(blog => blog.category))];
            setCategories(uniqueCategories);
        };

        fetchCategories();
    }, []);

    const handleSearch = () => {
        searchBlogs();
    };

    const goToBlogsPage = () => {
        history.push(paths.BLOGS.path);
    };

    const searchBlogs = async () => {
        const filters = [];

        if (author) {
            filters.push(where("author", "==", author));
        }

        if (category && category !== 'all') {
            filters.push(where("category", "==", category));
        }

        if (filters.length === 0) {
            setSearchResults([]);
            return;
        }

        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, ...filters);
        const querySnapshot = await getDocs(q);
        const results = [];

        for (const docSnap of querySnapshot.docs) {
            const blogData = docSnap.data();
            let authorDetails = {};

            if (blogData.authorId) {
                const authorRef = doc(db, "authors", blogData.authorId);
                const authorSnap = await getDoc(authorRef);
                if (authorSnap.exists()) {
                    authorDetails = authorSnap.data();
                }
            }

            results.push({
                id: docSnap.id,
                ...blogData,
                authorDetails,
            });
        }

        setSearchResults(results);
    };

    return (
        <div style={styles.Screen}>
            {showContentModal && (
                <AlertModal
                    title={modalContent.title}
                    message={(
                        <div style={styles.modalMessageContent}>
                            {modalContent.content}
                        </div>
                    )}
                    onClose={handleCloseModal}
                />
            )}
            <div style={styles.SearchContainer}>
                <input
                    type="text"
                    style={styles.SearchInput}
                    placeholder="Search by Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value.toLowerCase())}
                />
                <select
                    style={styles.SearchInput}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="" disabled>Search by Category</option>
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <button style={styles.SearchButton} onClick={handleSearch}>Search</button>
                <button style={styles.SearchButton} onClick={goToBlogsPage}>Back to Blogs</button>
            </div>

            <div style={styles.SearchResults}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Author</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>View Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <tr key={result.id}>
                                    <td style={styles.td}>{result.title}</td>
                                    <td style={styles.td}>
                                        {result.authorDetails?.name || result.author}
                                        <br />
                                        {result.authorDetails?.email}
                                    </td>
                                    <td style={styles.td}>{result.category}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleViewContent(result)}
                                            style={styles.viewButton}>
                                            👁️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Search;
