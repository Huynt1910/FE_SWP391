# BamboSpa Next App

## Features

- Online booking system for spa services
- Therapist selection and scheduling
- Service management
- Google Authentication for easy login
- Payment integration with VNPay

## Authentication

The app supports both traditional username/password authentication and Google Sign-In through Firebase Authentication. See [Firebase Setup Guide](./docs/FIREBASE_SETUP.md) for details on setting up Google Authentication.

## Preview

```
Run production build with:

bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local` and fill in the values
   - Add Firebase configuration for Google Authentication
4. Run the development server: `npm run dev`

## Firebase Google Authentication

This project uses Firebase for Google Authentication. To set it up:

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Set up Google Authentication in Firebase
3. Add the Firebase configuration to your `.env.local` file
4. See the detailed [Firebase Setup Guide](./docs/FIREBASE_SETUP.md)
