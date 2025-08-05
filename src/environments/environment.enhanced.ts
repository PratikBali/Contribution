// Enhanced environment configuration with security features
export const environment = {
  firebase: {
    apiKey: 'AIzaSyApKrnBbWDh4TUKexQtsntcsnMndRTEsMw',
    authDomain: 'hydra-contri.firebaseapp.com',
    databaseURL: 'https://hydra-contri.firebaseio.com',
    projectId: 'hydra-contri',
    storageBucket: 'hydra-contri.appspot.com',
    messagingSenderId: '721305886241',
    appId: '1:721305886241:web:YOUR_APP_ID_HERE', // ⚠️ REPLACE WITH ACTUAL APP ID
    // Security features
    measurementId: 'G-XXXXXXXXXX', // Replace with actual measurement ID if using Analytics
  },
  production: false,
  
  // Security configuration
  security: {
    enableAppCheck: false, // Enable in production
    allowedDomains: ['localhost:4200', 'hydra-contri.firebaseapp.com'],
    enableLogging: true, // Disable in production
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Feature flags
  features: {
    googleLogin: true,
    emailVerification: true,
    multiFactorAuth: false,
    passwordRecovery: true,
  }
};
