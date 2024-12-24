import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    useEffect(() => {
        // Check if theme exists in localStorage
        const savedTheme = localStorage.getItem('theme') || 'dark';
        
        // Apply the theme
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        
        // Save theme preference
        localStorage.setItem('theme', savedTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
