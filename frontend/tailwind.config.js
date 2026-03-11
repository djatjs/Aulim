/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                "fade-in": {
                    from: { opacity: 0, transform: "translateY(-4px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
