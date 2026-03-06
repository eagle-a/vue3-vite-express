import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'glass-panel': 'backdrop-filter-blur-16px bg-white/85 border border-silver-400/30 rounded-20px',
    'entity-card': 'bg-surface rounded-20px p-6 shadow-md hover:shadow-xl transition-all',
    'btn-primary': 'bg-primary text-black rounded-16px px-6 py-2.5 font-medium hover:bg-primary-light transition-all',
    'btn-secondary': 'bg-surface-variant text-primary rounded-16px px-6 py-2.5 font-medium hover:bg-gray-200 transition-all',
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: '#A8A8A8',
        light: '#D4D4D4',
        dark: '#787878',
      },
      surface: {
        DEFAULT: '#FAFAFA',
        variant: '#F0F0F0',
        dark: '#1A1A1A',
      },
      background: {
        DEFAULT: '#FFFFFF',
        dark: '#000000',
      },
      text: {
        primary: '#000000',
        secondary: '#4A4A4A',
        hint: '#8A8A8A',
        dark: '#FFFFFF',
        'secondary-dark': '#B0B0B0',
        'hint-dark': '#707070',
      },
      silver: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A8A8A8',
        500: '#8B8B8B',
        600: '#787878',
        700: '#5C5C5C',
        800: '#3C3C3C',
        900: '#1A1A1A',
      },
    },
    breakpoints: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})