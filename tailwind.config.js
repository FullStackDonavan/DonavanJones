import colors from 'tailwindcss/colors'

export default {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.gray,
        'custom-gradient-from': '#320643',
        'custom-gradient-to': '#140534',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, #320643, #140534)',
      },
      keyframes: {
        'slide-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'slide-left': 'slide-left 15s linear infinite', // Adjusted duration for a smoother effect
      },
    }
  }
}
