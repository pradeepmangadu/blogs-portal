import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../../firebase-config';
import { paths } from "../../constants/paths";
import AlertModal from '../../components/AlertModal';
import { doc, setDoc,getDocs, collection, query, where } from 'firebase/firestore';

const styles = {
  Screen: {
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  Text: {
    marginLeft: "30%",
    color: "#030303",
    fontSize: "24px",
    fontFamily: "Roboto Mono",
    letterSpacing: "-0.6px",
    lineHeight: "32px",
    marginBottom: "20px",
  },
  Input: {
    top: "306px",
    left: "475px",
    width: "435px",
    height: "67px",
    padding: "0px 8px",
    border: "1px solid #030303",
    boxSizing: "border-box",
    borderRadius: "2px",
    backgroundColor: "#e6e6e6",
    color: "#94a3b8",
    fontSize: "14px",
    fontFamily: "Roboto Mono",
    lineHeight: "46px",
    outline: "none",
    marginBottom: "20px",
  },
  Button: {
    marginLeft: "12%",
    cursor: "pointer",
    top: "550px",
    left: "478px",
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
    marginBottom: "20px",
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
      const userData = userDoc.data();
      if(userData.password !== password){
         setAlertInfo({ title: 'Sign In Error', message: 'Invalid User Credentials.' });
         return;
      }
      history.push(paths.BLOGS.path);
    } catch (error) {
      setAlertInfo({ title: 'Login Failed', message: error.message });
    }
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
      <div style={styles.Text}>BlogsPortal</div>
      <form onSubmit={handleSignIn}>
        <div>
          <input
            style={styles.Input}
            placeholder={"Username (Email)"}
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            style={styles.Input}
            placeholder={"Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "40px" }}>
          <div>
            <button type="submit" style={styles.Button}>
              Sign In
            </button>
          </div>
          <div>
            <Link to={paths.SIGNUP.path} style={{ textDecoration: 'none' }}>
              <button type="button" style={styles.Button}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
