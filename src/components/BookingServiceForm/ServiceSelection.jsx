import React from 'react';
import { FaArrowRight, FaSpinner, FaPlus, FaCheck } from 'react-icons/fa';
import Link from 'next/link';

const ServiceSelection = ({ 
  services, 
  selectedServices, 
  onSelectService, 
  onNext, 
  loading, 
  error 
}) => {
  // Calculate total price of selected services
  const totalPrice = selectedServices.reduce((total, service) => total + (service.price || 0), 0);

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Categorize services by price range
  const categorizeServices = (services) => {
    return {
      basic: services.filter(service => parseFloat(service.price) < 1000000),
      medium: services.filter(service => parseFloat(service.price) >= 1000000 && parseFloat(service.price) <= 2000000),
      advance: services.filter(service => parseFloat(service.price) > 2000000)
    };
  };

  // Get services for each category
  const categorizedServices = services ? categorizeServices(services) : { basic: [], medium: [], advance: [] };

  // Render loading state
  if (loading) {
    return (
      <div className="service-selection__loading">
        <FaSpinner className="loading-icon" />
        <p>Loading services...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="service-selection__error">
        <div className="error-icon">
          <span className="error-x">×</span>
        </div>
        <h3>Unable To Load Services</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Render service card
  const renderServiceCard = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    return (
      <div
        key={service.id}
        className={`service-selection__card ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelectService(service)}
      >
        {service.imgUrl && (
          <div className="service-selection__card-image">
            <img 
              src={service.imgUrl || "/assets/img/services/placeholder.jpg"} 
              alt={service.name || "Service"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/img/services/placeholder.jpg";
              }}
            />
          </div>
        )}
        <div className="service-selection__card-content">
          <h3 className="service-selection__card-title">{service.name}</h3>
          <p className="service-selection__card-description">
            {service.description && service.description.length > 100 
              ? `${service.description.substring(0, 100)}...` 
              : service.description}
          </p>
          <div className="service-selection__card-details">
            <span className="service-selection__card-price">{formatPrice(service.price)}</span>
            {service.duration && (
              <span className="service-selection__card-duration">{service.duration}</span>
            )}
          </div>
        </div>
        <div className="service-selection__card-selector">
          {isSelected ? (
            <div className="service-selection__card-selected">
              <FaCheck />
            </div>
          ) : (
            <div className="service-selection__card-add">
              <FaPlus />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="service-selection">
      <h2 className="service-selection__title">Select Services</h2>
      <p className="service-selection__subtitle">
        Choose the services you would like to book
      </p>

      {services && services.length > 0 ? (
        <div className="service-selection__categories">
          {/* Basic Services Section */}
          {categorizedServices.basic.length > 0 && (
            <div className="service-selection__category basic">
              <h3 className="service-selection__category-title">Basic Services</h3>
              <div className="service-selection__list">
                {categorizedServices.basic.map(renderServiceCard)}
              </div>
            </div>
          )}

          {/* Medium Services Section */}
          {categorizedServices.medium.length > 0 && (
            <div className="service-selection__category medium">
              <h3 className="service-selection__category-title">Medium Services</h3>
              <div className="service-selection__list">
                {categorizedServices.medium.map(renderServiceCard)}
              </div>
            </div>
          )}

          {/* Advanced Services Section */}
          {categorizedServices.advance.length > 0 && (
            <div className="service-selection__category advance">
              <h3 className="service-selection__category-title">Advanced Services</h3>
              <div className="service-selection__list">
                {categorizedServices.advance.map(renderServiceCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="service-selection__empty">
          <p>No services available at the moment.</p>
          <Link href="/" className="service-selection__back-link">
            Return to Home
          </Link>
        </div>
      )}

      <div className="service-selection__summary">
        <div className="service-selection__summary-content">
          <div className="service-selection__summary-details">
            <span className="service-selection__summary-count">
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
            </span>
            <span className="service-selection__summary-total">
              Total: {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="service-selection__actions">
        <div className="service-selection__actions-left">
          <Link href="/" className="service-selection__cancel">
            Cancel
          </Link>
        </div>
        <button
          className="booking-actions__next"
          onClick={onNext}
          disabled={selectedServices.length === 0}
        >
          NEXT <FaArrowRight className="icon" />
        </button>
      </div>

      <style jsx>{`
        .service-selection__categories {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .service-selection__category {
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .service-selection__category.basic {
          border-top: 4px solid #4CAF50;
        }

        .service-selection__category.medium {
          border-top: 4px solid #2196F3;
        }

        .service-selection__category.advance {
          border-top: 4px solid #9C27B0;
        }

        .service-selection__category-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .service-selection__list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .service-selection__category {
            padding: 1rem;
          }

          .service-selection__category-title {
            font-size: 1.25rem;
          }

          .service-selection__list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceSelection; 