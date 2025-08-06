import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { paths } from "../../constants/paths";
import AlertModal from '../../components/AlertModal';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

const styles = {
  Screen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
    fontFamily: "Poppins, sans-serif",
  },
  Card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  Title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#333",
  },
  Input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
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
    marginBottom: "10px",
  },
  Link: {
    color: "#5ac8fa",
    textDecoration: "none",
    fontSize: "14px",
  },
};

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });
  const history = useHistory();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // setIsSignUpSuccess(false);
        setAlertInfo({ title: 'Sign In Error', message: 'No User with this email exists.' });
        return;
      }
      const userDoc = querySnapshot.docs[0];
      let userData;
      try {
        userData = userDoc.data();
      } catch (e) {
        console.log("Exception in login:", e.message);
      }

      if (userData && userData.password !== password) {
        setAlertInfo({ title: 'Sign In Error', message: 'Invalid User Credentials.' });
        return;
      }
      history.push(paths.BLOGS.path);
    } catch (error) {
      setAlertInfo({ title: 'Login Failed', message: error.message });
    }
  };

  return (
    <div style={styles.Screen}>
      <div style={styles.Card}>
        <div style={styles.Title}>BlogsPortal Login</div>
          <form onSubmit={handleSignIn}>
            <input
              style={styles.Input}
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              style={styles.Input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={styles.Button}>Sign In</button>
            <Link to={paths.SIGNUP.path} style={styles.Link}>Sign Up</Link>
            {/* <div style={{ marginTop: "10px" }}>
              <Link to="/forgot-password" style={styles.Link}>Forgot Password?</Link>
            </div> */}
          </form>
        </div>
      </div>
    );
};

export default Login;
