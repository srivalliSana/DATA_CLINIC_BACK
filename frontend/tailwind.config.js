/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 10px 25px rgba(0,0,0,0.15)',
        soft: '0 8px 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'dash-slow': 'dash 20s linear infinite',
        'float-slow': 'float 15s ease-in-out infinite',
        'gradient-x': 'gradient-x 10s ease infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        tilt: 'tilt 10s infinite linear',
      },
      keyframes: {
        dash: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '100' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      colors: ({ colors }) => ({
        ...colors,

        /* ✨ Professional palette integrated with your naming convention */
        normalText: { light: '#111827', dark: '#F8FAFC' },
        backgroundTop: { light: '#F9FAFB', dark: '#0F172A' },
        backgroundBottom: { light: '#F3F4F6', dark: '#1E293B' },
        greenButtons: { light: '#16A34A', dark: '#22C55E' },
        mainText: { light: '#1E3A8A', dark: '#60A5FA' },
        textInFrame: { light: '#F8FAFC', dark: '#F1F5F9' },
        strokeColor: { light: '#E5E7EB', dark: '#334155' },
        buttonGreen: { light: '#22C55E', dark: '#16A34A' },
        updateFrameBg: { light: '#F8FAFC', dark: '#1E293B' },
        navBar: { light: '#FFFFFF', dark: '#0F172A' },
        mainTextOther: { light: '#111827', dark: '#F8FAFC' },
        forgotPassword: { light: '#2563EB', dark: '#3B82F6' },
        accent: { light: '#2563EB', dark: '#60A5FA' },
      }),
    },
  },
  plugins: [],
};
