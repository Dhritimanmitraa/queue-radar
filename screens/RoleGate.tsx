import React from 'react';

// Simple web navigation without react-router-dom
const navigate = (path: string) => {
  window.location.hash = path;
};

export default function RoleGate() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Queue Radar</h1>
        <p style={styles.subtitle}>Skip the wait, find your cut</p>
      </div>

      <div style={styles.buttonContainer}>
        <div style={styles.buttonWrapper}>
          <button
            style={styles.customerButton}
            onClick={() => navigate('/customer')}
          >
            I'm a Customer
          </button>
          <p style={styles.buttonDescription}>
            Find nearby salons with live queue information
          </p>
        </div>

        <div style={styles.buttonWrapper}>
          <button
            style={styles.barberButton}
            onClick={() => navigate('/barber')}
          >
            I'm a Barber
          </button>
          <p style={styles.buttonDescription}>
            Manage your salon's queue in real-time
          </p>
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          🚀 Demo Version - Real-time queue updates powered by Firebase
        </p>
        <p style={styles.footerText}>
          📱 <strong>Best Experience:</strong> Download the native Android APK for full functionality!
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center' as 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold' as 'bold',
    color: '#333',
    marginBottom: '8px',
    margin: 0
  },
  subtitle: {
    fontSize: '20px',
    color: '#666',
    fontStyle: 'italic' as 'italic',
    margin: 0
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '30px',
    width: '100%',
    maxWidth: '400px'
  },
  buttonWrapper: {
    textAlign: 'center' as 'center',
  },
  customerButton: {
    backgroundColor: '#007AFF',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px'
  },
  barberButton: {
    backgroundColor: '#34C759',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px'
  },
  buttonDescription: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center' as 'center',
    margin: 0
  },
  footer: {
    position: 'absolute' as 'absolute',
    bottom: '40px',
    textAlign: 'center' as 'center',
    maxWidth: '600px'
  },
  footerText: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'center' as 'center',
    margin: '5px 0'
  },
}; 