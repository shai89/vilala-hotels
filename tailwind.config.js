/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        vilala: {
          primary: '#8B5CF6',
          secondary: '#06B6D4',
          accent: '#F59E0B',
          neutral: '#374151',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#e5e7eb',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
    ],
  },
};