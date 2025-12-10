import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      colors: {
        cream: '#FAF9F6',
        charcoal: '#1c1c1c', 
        stone: {
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
        }
      }
    },
  },
  plugins: [],
};
export default config;