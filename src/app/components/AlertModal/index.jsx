import React from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
    border: '1px solid #030303',
  },
  title: {
    color: '#030303',
    fontSize: '24px',
    fontFamily: 'Roboto Mono',
    marginBottom: '15px',
    marginTop: '10px',
  },
  message: {
    color: '#030303',
    fontSize: '16px',
    fontFamily: 'Roboto Mono',
    marginBottom: '20px',
  },
  button: {
    cursor: 'pointer',
    width: '120px',
    height: '40px',
    padding: '0px 8px',
    border: '1px solid #030303',
    boxSizing: 'border-box',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.8)',
    backgroundColor: '#5ac8fa',
    color: '#030303',
    fontSize: '14px',
    fontFamily: 'Roboto Mono',
    textTransform: 'uppercase',
    outline: 'none',
  },
};

const AlertModal = ({ title, message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <button style={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
