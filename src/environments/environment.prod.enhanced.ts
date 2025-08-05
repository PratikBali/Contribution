// Enhanced production environment configuration with maximum security
export const environment = {
  firebase: {
    apiKey: 'AIzaSyApKrnBbWDh4TUKexQtsntcsnMndRTEsMw',
    authDomain: 'hydra-contri.firebaseapp.com',
    databaseURL: 'https://hydra-contri.firebaseio.com',
    projectId: 'hydra-contri',
    storageBucket: 'hydra-contri.appspot.com',
    messagingSenderId: '721305886241',
    appId: '1:721305886241:web:YOUR_APP_ID_HERE', // ⚠️ REPLACE WITH ACTUAL APP ID
    measurementId: 'G-XXXXXXXXXX', // Replace with actual measurement ID
  },
  production: true,
  
  // Enhanced security configuration for production
  security: {
    enableAppCheck: true, // ✅ Enable App Check in production
    allowedDomains: [
      'hydra-contri.firebaseapp.com',
      'hydra-contri.web.app',
      'your-custom-domain.com' // Add your production domain
    ],
    enableLogging: false, // ✅ Disable debug logging in production
    sessionTimeout: 60 * 60 * 1000, // 1 hour for production
    maxLoginAttempts: 3, // Stricter in production
    lockoutDuration: 30 * 60 * 1000, // 30 minutes lockout
    enforceHttps: true,
    enableCSP: true, // Content Security Policy
  },
  
  // API configuration optimized for production
  api: {
    timeout: 15000, // Shorter timeout for production
    retryAttempts: 2,
    retryDelay: 2000,
  },
  
  // Feature flags for production
  features: {
    googleLogin: true,
    emailVerification: true,
    multiFactorAuth: true, // Enable MFA in production
    passwordRecovery: true,
    analytics: true,
    crashReporting: true,
  }
};
