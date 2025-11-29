/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    bg: '#040609',
                    bgLight: '#080b12',
                    surface: '#0d111f',
                    surfaceLight: '#15192b',
                    primary: '#00d9ff',
                    primaryGlow: 'rgba(0, 217, 255, 0.4)',
                    secondary: '#ff2e97',
                    secondaryGlow: 'rgba(255, 46, 151, 0.4)',
                    accent: '#7b2cbf',
                    success: '#00ff88',
                    warning: '#ffaa00',
                    danger: '#ff3366',
                    text: '#e4e8f0',
                    textMuted: '#8b92b0',
                    border: 'rgba(0, 217, 255, 0.2)',
                    borderSubtle: 'rgba(255, 255, 255, 0.1)',
                },
                light: {
                    bg: '#f8fafc',
                    surface: '#ffffff',
                    surfaceHover: '#f1f5f9',
                    text: '#000000',
                    textMuted: '#000000',
                    border: '#e2e8f0',
                    borderSubtle: '#cbd5e1',
                    categoryBorder: '#1e40af',
                    categoryHeading: '#3b82f6',
                    success: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                }
            },
            fontFamily: {
                heading: ['Orbitron', 'sans-serif'],
                body: ['Rajdhani', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'grid-move': 'gridMove 20s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
                    '100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
                },
                gridMove: {
                    '0%': { transform: 'translate(0, 0)' },
                    '100%': { transform: 'translate(50px, 50px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
