/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        'scale-up': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'scale-up': 'scale-up 0.5s'
      }
    },
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        '::-webkit-scrollbar': {
          width: '5px',
        },
        '::-webkit-scrollbar-track': {
          background: theme('colors.purple.200'),
          borderRadius: '1px',
        },
        '::-webkit-scrollbar-thumb': {
          background: theme('colors.purple.400'),
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: theme('colors.purple.500'),
        },
      });
    },
    function ({ addUtilities }) {
      addUtilities({
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
        },
      });
    },
  
  ],
}