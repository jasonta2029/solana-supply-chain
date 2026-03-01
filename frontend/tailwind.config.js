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
                background: "#FAFAFA",
                foreground: "#0F172A",
                muted: "#F1F5F9",
                "muted-foreground": "#64748B",
                accent: "#0052FF",
                "accent-secondary": "#4D7CFF",
                accent_foreground: "#FFFFFF",
                border: "#E2E8F0",
                card: "#FFFFFF",
                ring: "#0052FF",
            },
            fontFamily: {
                display: ["Calistoga", "serif"],
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                xl: "12px",
                "2xl": "16px",
            },
            boxShadow: {
                "accent-sm": "0 4px 14px rgba(0, 82, 255, 0.15)",
                "accent-md": "0 4px 14px rgba(0, 82, 255, 0.25)",
                "accent-lg": "0 8px 24px rgba(0, 82, 255, 0.35)",
            }
        },
    },
    plugins: [],
};
