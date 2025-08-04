import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where
} from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import AlertModal from '../../components/AlertModal';

const styles = {
  Screen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
    fontFamily: 'Poppins, sans-serif',
  },
  Card: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#000',
  },
  Title: {
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#333',
  },
  Input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    color: '#333',
    outline: 'none',
  },
  Button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5ac8fa',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    marginBottom: '10px',
  },
  Link: {
    color: '#333',
    textDecoration: 'underline',
    fontSize: '14px',
  },
};

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();
  const [alertInfo, setAlertInfo] = useState({ title: '', message: '' });
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const handleSignUp = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsSignUpSuccess(false);
      setAlertInfo({ title: 'Sign Up', message: 'Passwords do not match' });
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsSignUpSuccess(false);
        setAlertInfo({ title: 'Sign Up Error', message: 'User with this email already exists.' });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        username,
        // Do NOT store password in Firestore in production
      });

      setIsSignUpSuccess(true);
      setAlertInfo({ title: 'Sign Up', message: 'Account created successfully!' });
    } catch (error) {
      setIsSignUpSuccess(false);
      const errorMessage = error.message || 'An error occurred during sign up.';
      setAlertInfo({ title: 'Sign Up Error', message: errorMessage });
    }
  };

  const handleAlertClose = () => {
    setAlertInfo({ title: '', message: '' });
    if (isSignUpSuccess) {
      history.push('/');
    }
  };

  return (
    <div style={styles.Screen}>
      <div style={styles.Card}>
        <AlertModal
          title={alertInfo.title}
          message={alertInfo.message}
          onClose={handleAlertClose}
        />
        <div style={styles.Title}>🎉 Create Your Account</div>
        <form onSubmit={handleSignUp}>
          <input
            style={styles.Input}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={styles.Input}
            placeholder="Email"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.Input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            style={styles.Input}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.Button}>Sign Up</button>
          <Link to="/" style={styles.Link}>Back to Login</Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
