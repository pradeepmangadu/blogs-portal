import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where} from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import AlertModal from '../../components/AlertModal';

const styles = {
  Screen: {
    backgroundColor: '#ffffff',
    position:'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  Text: {
    marginLeft: '30%',
    color: '#030303',
    fontSize: '24px',
    fontFamily: 'Roboto Mono',
    letterSpacing: '-0.6px',
    lineHeight: '32px',
    marginBottom: '20px',
  },
  Input: {
    top: '306px',
    left: '475px',
    width: '435px',
    height: '67px',
    padding: '0px 8px',
    border: '1px solid #030303',
    boxSizing: 'border-box',
    borderRadius: '2px',
    backgroundColor: '#e6e6e6',
    color: '#94a3b8',
    fontSize: '14px',
    fontFamily: 'Roboto Mono',
    lineHeight: '46px',
    outline: 'none',
    marginBottom: '20px',
  },
  Button: {
    marginLeft: '12%',
    cursor: 'pointer',
    top: '550px',
    left: '478px',
    width: '320px',
    height: '60px',
    padding: '0px 8px',
    border: '1px solid #030303',
    boxSizing: 'border-box',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.8)',
    backgroundColor: '#5ac8fa',
    color: '#030303',
    fontSize: '14px',
    fontFamily: 'Roboto Mono',
    lineHeight: '20px',
    textTransform: 'uppercase',
    outline: 'none',
    marginBottom: '20px',
  },
};

const SignUp = (props) => {
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
      const currentUser = auth.currentUser;
      let user;

      if (currentUser && currentUser.isAnonymous) {
        // An anonymous user exists, so link the new credentials
        // const credential = EmailAuthProvider.credential(username, password);
        // const userCredential = await linkWithCredential(currentUser, credential);
        // user = userCredential.user;
        // Update the user's profile with their name
        // await updateProfile(user, { displayName: name });
      } else {
        // No user or a non-anonymous user, so create a new account
        const userCredential = await createUserWithEmailAndPassword(auth, username, password);
        user = userCredential.user;
        await updateProfile(user, { displayName: name });
      }

      // Save/update user info in Firestore.
      // It's a major security risk to store passwords in Firestore.
      // Firebase Auth handles this securely behind the scenes.
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsSignUpSuccess(false);
        setAlertInfo({ title: 'Sign Up Error', message: 'User with this email already exists.' });
        return;
      }

      await setDoc(doc(db, 'users', currentUser.uid), { name, username });

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
      <AlertModal
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={handleAlertClose}
      />
      <div style={styles.Text}>SignUp</div>
      <form onSubmit={handleSignUp}>
        <div>
          <input style={styles.Input} placeholder={'Name'} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <input style={styles.Input} placeholder={'Username (Email)'} type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <input style={styles.Input} placeholder={'Password'} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <input style={styles.Input} placeholder={'Confirm Password'} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <div>
            <button type="submit" style={styles.Button}>
              Sign Up
            </button>
          </div>
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button type="button" style={styles.Button}>
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
