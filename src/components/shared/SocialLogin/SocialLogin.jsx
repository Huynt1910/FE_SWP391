import { useState } from 'react';
import { useGoogleAuth } from '@/auth/hook/useGoogleSignInHook';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import { showToast } from '@/utils/toast';

export const SocialLogin = ({ onAuthSuccess }) => {
  const { googleSignIn, isPending } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await googleSignIn();
      
      if (response && response.success && onAuthSuccess) {
        onAuthSuccess(response);
      } else if (!response || !response.success) {
        // Show error message
        const errorMsg = response?.message || "Failed to sign in with Google";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      const errorMsg = error?.message || "An unexpected error occurred";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-form__social-container'>
      <button 
        onClick={handleGoogleSignIn}
        disabled={isLoading || isPending}
        className='login-form__google-btn'
        aria-label="Sign in with Google"
      >
        {isLoading || isPending ? (
          <FaSpinner className="spinner" />
        ) : (
          <FaGoogle />
        )}
        <span>Login with with Google</span>
      </button>

      {error && (
        <div className="login-form__error">
          {error}
        </div>
      )}

      <style jsx>{`
        .login-form__social-container {
          width: 100%;
          margin-bottom: 20px;
        }
        
        .login-form__google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #e0e0e0;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          color: #333;
        }
        
        .login-form__google-btn:hover {
          background-color: #f5f5f5;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .login-form__google-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .login-form__google-btn span {
          margin-left: 10px;
        }
        
        .login-form__error {
          color: #d32f2f;
          font-size: 12px;
          margin-top: 8px;
          text-align: center;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};