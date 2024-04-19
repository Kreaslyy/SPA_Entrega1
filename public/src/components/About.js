import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Acerca de Nosotros</h1>
      <p style={styles.paragraph}>Esta es una página sobre nosotros y nuestro trabajo.</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '16px',
    color: '#666',


    
  },
};

export default About;
