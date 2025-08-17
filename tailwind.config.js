/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Brand Colors
        brand: {
          primary: '#FFD100',
          secondary: '#000000',
          yellow: {
            50: '#FFFEF7',
            100: '#FFFAEB',
            200: '#FFF3C4',
            300: '#FFEC9C',
            400: '#FFE066',
            500: '#FFD100',
            600: '#E6BC00',
            700: '#CC9900',
            800: '#B38600',
            900: '#996600',
          },
          black: {
            50: '#F7F7F7',
            100: '#E3E3E3',
            200: '#C8C8C8',
            300: '#A4A4A4',
            400: '#818181',
            500: '#666666',
            600: '#515151',
            700: '#434343',
            800: '#383838',
            900: '#000000',
          }
        }
      },
    },
  },
  plugins: [],
};
