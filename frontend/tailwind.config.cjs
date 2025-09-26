// 
// frontend/tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'fin-blue': { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 900: '#1e3a8a' },
        'fin-green': { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a' },
        'fin-red': { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626' },
        'fin-gray': { 50: '#f9fafb', 100: '#f3f4f6', 800: '#1f2937', 900: '#111827' }
      },
      fontFamily: {
        'finance': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
