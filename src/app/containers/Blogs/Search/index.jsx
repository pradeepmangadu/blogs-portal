import React, { useState, useEffect } from "react";
import { db } from '../../../firebase-config';
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";

const styles = {
    Screen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        minHeight: '100vh',
        position: 'relative',
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
        margin: "10px", borderRadius: "5px",
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
        fontSize: "16px",
    },
    SearchResults: {
        width: "80%",
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
        margin: "5px 0",
    },
};

const Search = () => {
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const blogsCollection = collection(db, 'blogs');
            const blogsSnapshot = await getDocs(blogsCollection);
            const blogsList = blogsSnapshot.docs.map(doc => doc.data());
            // Create a unique list of categories
            const uniqueCategories = [...new Set(blogsList.map(blog => blog.category))];
            setCategories(uniqueCategories);
        };

        fetchCategories();
    }, []);
    const handleSearch = () => {
        searchBlogs();
    };
    const searchBlogs = async () => {

        if (!author && !category) {
            setSearchResults([]);
            return;
        }
        const blogsRef = collection(db, "blogs");
        let q = blogsRef

        if (author) {
            q = query(q, where("author", "==", author));
        }

        if (category && category !== 'all') {
            q = query(q, where("category", "==", category));
        }
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setSearchResults(results);

    };
    return (
        <div style={styles.Screen}>
            <div style={styles.SearchContainer}>
                <input
                    type="text"
                    style={styles.SearchInput}
                    placeholder="Search by Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
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
            </div>

            <div style={styles.SearchResults}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Author</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults && searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <tr key={result.id}>
                                    <td style={styles.td}>{result.title}</td>
                                    <td style={styles.td}>{result.author}</td>
                                    <td style={styles.td}>{result.category}</td>
                                    <td style={styles.td}>{result.content}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    );
};
export default Search;
