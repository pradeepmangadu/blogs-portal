import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    SearchContainer: {
        top: '20px',
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
};


const Search = () => {
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const history = useHistory();
    useEffect(() => {
        const email = localStorage.getItem('authorEmail');
        if (email) {
            setAuthor(email.toLowerCase()); // Normalize email
        }
    }, []);

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
                <Button variant="contained" endIcon={<SearchIcon />} onClick={handleSearch}>Search</Button> <span></span>
                <Button variant="contained" endIcon={<ArrowBackIcon />} color="error" onClick={goToBlogsPage}>Back to Blogs</Button>
            </div>

			<TableContainer component={Paper}>
				<Table aria-label="collapsible table">
					<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Title</TableCell>
						<TableCell>Author</TableCell>
						<TableCell>Category</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
						{searchResults .length > 0 ? (searchResults.map((result) => (
							<Row key={result.id} result={result} />
							))
						) : (
							<TableRow>
								<TableCell colSpan="4" align="center">No results found</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
    		</TableContainer>
        </div>
    );
};

function Row(props) {
  const { result } = props;
  const [open, setOpen] = React.useState(false);
  return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
				<IconButton
					aria-label="expand row"
					size="small"
					onClick={() => setOpen(!open)}
				>
					{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">{result.title}</TableCell>
				<TableCell> {result.authorDetails?.name || result.author} <br /> {result.authorDetails?.email}</TableCell>
				<TableCell>{result.category}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box sx={{ margin: 1 }}>
						<Typography variant="h6" gutterBottom component="div">
							{result.title}
						</Typography>
						<Typography component="p">
							{result.content}
						</Typography>
					</Box>
				</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>			
  );
}


export default Search;
