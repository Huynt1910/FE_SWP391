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

  // Group services by their category
  const groupServicesByCategory = (services) => {
    const grouped = {};
    
    if (services) {
      services.forEach(service => {
        const category = service.category || "Other Services";
        
        if (!grouped[category]) {
          grouped[category] = [];
        }
        
        grouped[category].push(service);
      });
    }
    
    return grouped;
  };

  // Get categorized services
  const categorizedServices = groupServicesByCategory(services);

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
          {Object.entries(categorizedServices).map(([category, categoryServices]) => (
            <div className="service-selection__category" key={category}>
              <h3 className="service-selection__category-title">{category}</h3>
              <div className="service-selection__list">
                {categoryServices.map(renderServiceCard)}
              </div>
            </div>
          ))}
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
          margin-bottom: 40px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .service-selection__category:nth-child(odd) {
          border-top: 4px solid #e2879d;
        }

        .service-selection__category:nth-child(even) {
          border-top: 4px solid #7facc8;
        }

        .service-selection__category-title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .service-selection__list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .service-selection__category {
            padding: 15px;
          }

          .service-selection__category-title {
            font-size: 20px;
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