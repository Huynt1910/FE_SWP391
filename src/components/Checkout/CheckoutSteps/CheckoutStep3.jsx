import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export const CheckoutStep3 = () => {
  const styles = {
    checkoutSuccess: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      maxWidth: '600px',
      margin: '40px auto',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    successIcon: {
      fontSize: '80px',
      color: '#4CAF50',
      marginBottom: '20px',
    },
    heading: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#333333',
      margin: '0 0 10px 0',
    },
    message: {
      fontSize: '18px',
      color: '#666666',
      marginBottom: '30px',
    },
    homeButton: {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#4CAF50',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background-color 0.3s ease',
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .success-icon {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .success-content {
          animation: fadeIn 0.8s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
      <div style={styles.checkoutSuccess}>
        <div className="success-icon" style={styles.successIcon}>
          <FaCheckCircle />
        </div>
        <div className="success-content">
          <h2 style={styles.heading}>Payment successfully!</h2>
          <p style={styles.message}>Thank you for your payment. Your order has been processed.</p>
          <Link href="/" style={styles.homeButton}>
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};
