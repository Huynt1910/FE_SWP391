import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/layout/PublicLayout";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import useListAllServices from "@/auth/hook/useListAllServices";
import { FaSpinner, FaCalendarAlt } from "react-icons/fa";

const ServiceDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, getServiceById } = useListAllServices();
  const [service, setService] = useState(null);

  useEffect(() => {
    if (id) {
      console.log("Fetching service with ID:", id);
      getServiceById(id).then(result => {
        if (result) {
          console.log("Service fetched:", result);
          setService(result);
        }
      });
    }
  }, [id]);

  const handleBookNow = () => {
    router.push(`/booking?serviceId=${id}`);
  };

  const breadcrumbsData = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Services",
      path: "/service",
    },
    {
      label: service?.name || "Service Details",
      path: `/service/${id}`,
    },
  ];

  // Render loading state
  if (loading) {
    return (
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Service Details">
        <div className="service-detail__loading">
          <div className="spinner-container">
            <FaSpinner className="spinner" />
          </div>
          <p>Loading service details...</p>
        </div>
      </PublicLayout>
    );
  }

  // Render error state
  if (error) {
    const isAuthError = typeof error === 'string' && (
      error.toLowerCase().includes("authentication") || 
      error.toLowerCase().includes("log in") || 
      error.toLowerCase().includes("session") || 
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("expired")
    );
    
    return (
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Service Details">
        <div className="service-detail__error">
          <h3>Unable to load service details</h3>
          <p>{error}</p>
          
          {isAuthError ? (
            <button 
              className="login-button"
              onClick={() => router.push('/login')}
            >
              Log In
            </button>
          ) : (
            <button 
              className="back-button"
              onClick={() => router.push('/service')}
            >
              Back to Services
            </button>
          )}
        </div>
      </PublicLayout>
    );
  }

  // Render no service found
  if (!service && !loading) {
    return (
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Service Not Found">
        <div className="service-detail__not-found">
          <h3>Service Not Found</h3>
          <p>The service you are looking for does not exist or has been removed.</p>
          <button 
            className="back-button"
            onClick={() => router.push('/service')}
          >
            Back to Services
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle={service?.name || "Service Details"}>
      {service && (
        <div className="service-detail">
          <div className="wrapper">
            <div className="service-detail__content">
              <div className="service-detail__image">
                <img 
                  src={service.imgUrl || "/assets/img/services/placeholder.jpg"} 
                  alt={service.name} 
                />
              </div>
              <div className="service-detail__info">
                <h1 className="service-detail__title">{service.name}</h1>
                {service.category && service.category !== "General" && (
                  <div className="service-detail__category">{service.category}</div>
                )}
                <div className="service-detail__price">${service.price}</div>
                <div className="service-detail__description">
                  <p>{service.description}</p>
                </div>
                {service.duration && (
                  <div className="service-detail__duration">
                    <span className="duration-label">Duration:</span> {service.duration}
                  </div>
                )}
                <button 
                  className="service-detail__book-btn"
                  onClick={handleBookNow}
                >
                  <FaCalendarAlt /> Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Subscribe />
    </PublicLayout>
  );
};

export default ServiceDetail; 