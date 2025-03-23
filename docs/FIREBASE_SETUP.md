# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication with Google Sign-In for your Skincare Booking application.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the instructions to create a new project
3. Give your project a name (e.g., "Skincare Booking")
4. Accept the Firebase terms and click "Continue"
5. Choose whether to enable Google Analytics (recommended) and click "Create project"

## Step 2: Register Your Web App

1. From your Firebase project dashboard, click the Web icon (</>) to add a web app
2. Give your app a nickname (e.g., "Skincare Booking Web")
3. Check the box for "Also set up Firebase Hosting" if you plan to deploy with Firebase
4. Click "Register app"
5. Firebase will provide you with configuration details. Copy this information for the next step.

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with the actual values from your Firebase project:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 4: Enable Google Authentication

1. In the Firebase Console, go to "Authentication" from the left sidebar
2. Click the "Sign-in method" tab
3. Click on "Google" in the list of providers
4. Toggle the "Enable" switch to on
5. Configure your support email for the project
6. Click "Save"

## Step 5: Configure Your Backend API

The Firebase authentication needs to be integrated with your backend API. Make sure your backend supports the `/authentication/login-gg` endpoint that expects:

```json
{
  "idToken": "firebase_id_token",
  "email": "user_email",
  "displayName": "user_name",
}
```

The backend should verify the Firebase ID token, create or retrieve the user, and return:

```json
{
  "success": true,
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "userId": "user_id",
  "role": "user_role"
}
```

## Testing the Integration

After completing these steps, you should be able to:

1. Visit your application's login page
2. Click the Google icon in the social login section
3. Select your Google account in the popup
4. Be automatically logged in and redirected based on your role

## Troubleshooting

- **"Firebase app already exists"**: This error means Firebase is being initialized multiple times. Make sure the Firebase config file is only imported once.
- **"Authentication domain not configured"**: Make sure the domain you're testing on is added to the authorized domains list in Firebase Authentication settings.
- **"Pop-up closed by user"**: This usually means the user closed the Google sign-in popup. No action needed.
- **Console errors about CORS**: Your backend API may need to enable CORS for the Firebase authentication to work correctly.

For any other issues, check the Firebase documentation or contact support. 