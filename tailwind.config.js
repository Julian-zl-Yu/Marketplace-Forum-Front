/** @type {import('tailwindcss').Config} */
export default { content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontSize: {
                xs: '22',
                sm: '24px',
                base: '26px',
                lg: '28px',
                xl: '30px',
            },

            fontFamily: {
                zcool: ['"ZCOOL KuaiLe"', 'sans-serif'],
            }
        },
    }, plugins: [] }

