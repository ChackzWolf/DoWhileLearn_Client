import tailwindcssAnimate from "tailwindcss-animate";

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
        'scale-up': 'scale-up 0.5s',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        primary: '#7C24F0', // New vibrant purple
        accent: '#f4f2f5', // Retaining the golden yellow for strong contrast
        softPeach: '#E0BFFF', // Soft lavender-peach for balance
        lavender: '#D1B3FF', // Adjusted lighter lavender for gradients
        'purple-to-lavender-start': '#7C24F0', // Matches new primary
        'purple-to-lavender-end': '#D1B3FF', // Adjusted lavender
        'purple-to-peach-start': '#7C24F0', // Matches new primary
        'purple-to-peach-end': '#E0BFFF', // Soft peach-lavender
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
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
    }
  ],
}


