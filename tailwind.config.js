// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       animation: {
//         'spin-slow': 'spin 8s linear infinite',
//       }
//     },
//   },
//   plugins: [],
// }






/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
      // Adding the safe-area-inset here makes the 'pt-safe' class available
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [],
}