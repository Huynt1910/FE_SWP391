import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { FIREBASE_CONFIG } from "@/lib/api-client/constant";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize analytics in client side only
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // The signed-in user info
    const user = result.user;
    
    // Extract user information needed for API call
    const userInfo = {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      token: token,
      idToken: user.stsTokenManager.accessToken, // Firebase ID token for backend verification
    };
    
    return {
      success: true,
      user: userInfo,
    };
  } catch (error) {
    // Handle Errors here
    const errorCode = error.code;
    const errorMessage = error.message;
    
    console.error("Google sign-in error:", error);
    
    return {
      success: false,
      errorCode,
      errorMessage,
    };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
};

export { app, auth, analytics }; 