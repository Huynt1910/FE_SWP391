import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { FaStar, FaCalendarAlt, FaLock } from "react-icons/fa";
import { getTherapistById } from "@/services/therapistService";
import { isAuthenticated } from "@/utils/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import ReviewList from "@/components/ReviewList";
import Layout from "@/components/Layout";

export default function TherapistDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchTherapist = async () => {
      try {
        setLoading(true);
        const data = await getTherapistById(id);
        setTherapist(data);
      } catch (err) {
        console.error("Error fetching therapist:", err);
        setError(err.message || "Failed to load therapist details");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  const handleBookAppointment = () => {
    if (!isAuth) {
      // Store the current URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', router.asPath);
      router.push('/login');
      return;
    }
    
    router.push(`/booking?therapistId=${id}`);
  };

  // Render authentication required message for booking
  const renderAuthButton = () => {
    if (isAuth) {
      return (
        <button 
          className="therapist-detail__book-btn"
          onClick={handleBookAppointment}
        >
          <FaCalendarAlt /> Book Appointment
        </button>
      );
    } else {
      return (
        <div className="therapist-detail__auth-required">
          <button 
            className="therapist-detail__login-btn"
            onClick={handleBookAppointment}
          >
            <FaLock /> Log In to Book
          </button>
          <p className="therapist-detail__auth-note">
            Authentication required for booking
          </p>
        </div>
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!therapist) return <ErrorDisplay message="Therapist not found" />;

  return (
    <Layout>
      <Head>
        <title>{therapist.name} | Therapist Profile</title>
        <meta name="description" content={`Learn more about ${therapist.name}, one of our professional therapists.`} />
      </Head>

      <div className="therapist-detail">
        <div className="therapist-detail__header">
          <div className="therapist-detail__image-container">
            {therapist.profileImage ? (
              <Image
                src={therapist.profileImage}
                alt={therapist.name}
                width={300}
                height={300}
                className="therapist-detail__image"
              />
            ) : (
              <div className="therapist-detail__placeholder">
                {therapist.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="therapist-detail__info">
            <h1 className="therapist-detail__name">{therapist.name}</h1>
            <p className="therapist-detail__specialty">{therapist.specialty}</p>
            
            <div className="therapist-detail__rating">
              <FaStar className="therapist-detail__star" />
              <span>{therapist.rating || "New"}</span>
              <span className="therapist-detail__reviews">
                ({therapist.reviewCount || 0} reviews)
              </span>
            </div>

            <p className="therapist-detail__experience">
              {therapist.yearsOfExperience} years of experience
            </p>

            {renderAuthButton()}
          </div>
        </div>

        <div className="therapist-detail__content">
          <div className="therapist-detail__about">
            <h2>About</h2>
            <p>{therapist.bio || "No bio available."}</p>
          </div>

          <div className="therapist-detail__specializations">
            <h2>Specializations</h2>
            <ul>
              {therapist.specializations && therapist.specializations.length > 0 ? (
                therapist.specializations.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))
              ) : (
                <li>No specializations listed</li>
              )}
            </ul>
          </div>

          <div className="therapist-detail__reviews">
            <h2>Reviews</h2>
            <ReviewList therapistId={id} />
          </div>
        </div>
      </div>
    </Layout>
  );
} 