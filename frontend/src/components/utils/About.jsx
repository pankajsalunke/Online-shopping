// src/pages/About.js

import React from 'react';

const About = () => {
    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                <h1 style={styles.title}>About Us</h1>
                <p style={styles.paragraph}>
                    Welcome to our Online Shopping Platform! We aim to provide you with an exceptional shopping experience, offering a wide variety of products across different categories. Our mission is to make shopping easier, faster, and more enjoyable for all our users.
                </p>
                <p style={styles.paragraph}>
                    Our platform is designed to bring you the best quality products from trusted sellers. We focus on customer satisfaction, providing excellent customer service, secure payment methods, and timely delivery.
                </p>
                <p style={styles.paragraph}>
                    Whether you're shopping for electronics, clothing, or household items, we are your one-stop destination for all your shopping needs. Thank you for choosing us!
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '40px',
    },
    contentWrapper: {
        maxWidth: '800px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-out',
    },
    title: {
        fontSize: '42px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    paragraph: {
        fontSize: '18px',
        lineHeight: '1.8',
        color: '#555',
        marginBottom: '25px',
        padding: '0 10px',
    },
    // Adding fade-in animation for a smoother entrance
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
    }
};

export default About;
