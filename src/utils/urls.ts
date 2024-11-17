
// export const getBaseUrl = () => {
//   // Check if we're running on the server side
//   if (typeof window === 'undefined') {
//     // Server-side
//     if (process.env.VERCEL_URL) {
//       return `https://${process.env.VERCEL_URL}`;
//     }
//     if (process.env.NEXT_PUBLIC_API_URL) {
//       return process.env.NEXT_PUBLIC_API_URL;
//     }
//     // Default to localhost in development
//     return 'http://localhost:3000';
//   }
  
//   // Client-side - use relative URL
//   return '';
// };

// utils/urls.ts
const getBaseUrl = () => {
  if (process.env.API_URL) return process.env.API_URL
  // if (process.env.API_URL) return process.env.API_URL
  return 'http://localhost:3000'
}

export { getBaseUrl }

