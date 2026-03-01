/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f1115",
                surface: "#1a1d24",
                primary: "#14F195", // Solana Green
                secondary: "#9945FF" // Solana Purple
            }
        },
    },
    plugins: [],
};
