/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    bg: '#000000',
                    card: '#121212',
                    hover: '#1E1E1E',
                    border: '#2A2A2A',
                    text: '#D1D5DB',
                    muted: '#8B929B',
                    accent: '#6CA2C8',
                    accentGreen: '#34D399',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
