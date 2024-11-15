// export const getBaseUrl = () => {
//   const isServer = typeof window === 'undefined'
//   const isDevelopment = process.env.NODE_ENV === 'development'
  
//   if (isServer) {
//     // Server-side
//     // return process.env.API_URL || 'http://localhost:3000'
//     return process.env.NEXT_PUBLIC_API_URL || 
//            `https://${process.env.VERCEL_URL}` ||
//            'http://localhost:3000';
//   }
  
//   // Client-side
//   return ''  // Use relative URL on client side
// }

// utils/urls.ts
export const getBaseUrl = () => {
  // Check if we're running on the server side
  if (typeof window === 'undefined') {
    // Server-side
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Default to localhost in development
    return 'http://localhost:3000';
  }
  
  // Client-side - use relative URL
  return '';
};

  
// export const getBaseUrl = () => {
//   const isServer = typeof window === 'undefined'
  
//   if (isServer) {
//     // Server-side
//     if (process.env.VERCEL_URL) {
//       // Vercel deployment
//       return `https://${process.env.VERCEL_URL}`
//     }
//     if (process.env.NEXT_PUBLIC_API_URL) {
//       // Custom deployment URL
//       return process.env.NEXT_PUBLIC_API_URL
//     }
//     // Local development
//     return process.env.API_URL || 'http://localhost:3000'
//   }
  
//   // Client-side - use relative URL
//   return ''
// }

// // Export a config object if needed
// export const config = {
//   baseUrl: getBaseUrl()
// }
