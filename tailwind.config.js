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
    }
  }
}