import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Slider from "rc-slider";
import Dropdown from "react-dropdown";
import { FaSearch, FaSpinner, FaClock, FaAngleDown, FaAngleUp, FaLock, FaShoppingCart } from "react-icons/fa";
import useListAllServices from "@/auth/hook/useListAllServices";
import { PagingList } from "@components/shared/PagingList/PagingList";
import { usePagination } from "@components/utils/Pagination/Pagination";
import { useCart } from "@/context/CartContext";

import { showToast } from "@/utils/toast";
import { isAuthenticated, redirectToLogin } from "@/utils/auth";

// React Range - Use regular Range instead of createSliderWithTooltip
const Range = Slider.Range;
const options = [
  { value: "highToMin", label: "From expensive to cheap" },
  { value: "minToHigh", label: "From cheap to expensive" },
];

export const Service = () => {
  const router = useRouter();
  const { loading, error, data: services, getAllServices } = useListAllServices();
  // const { addToCart } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortedServices, setSortedServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [categorizedServices, setCategorizedServices] = useState({});

  // Fetch services on component mount
  useEffect(() => {
    console.log("Service: Fetching services...");
    getAllServices().then(result => {
      console.log("Service: Services fetched, count:", result?.length || 0);
    });
  }, []);

  // Update sorted services when data changes
  useEffect(() => {
    if (services && services.length > 0) {
      console.log("Services data:", services);
      // Make sure we have price data and handle sorting
      const sorted = [...services].sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA; // High to low by default
      });
      setSortedServices(sorted);
      setFilteredServices(sorted); // Initialize filtered services
      
      // Group services by category
      const groupedByCategory = groupServicesByCategory(sorted);
      setCategorizedServices(groupedByCategory);
    }
  }, [services]);

  // Filter services based on search and category
  useEffect(() => {
    if (sortedServices.length > 0) {
      const filtered = sortedServices.filter(service => {
        // Filter by search term
        const name = service.name || "";
        const description = service.description || "";
        const matchesSearch = searchTerm === "" || 
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by category
        const category = service.category || "";
        const matchesCategory = categoryFilter === "" || category.toLowerCase() === categoryFilter.toLowerCase();
        
        return matchesSearch && matchesCategory;
      });
      
      setFilteredServices(filtered);
      
      // Update categorized services when filters change
      const groupedByCategory = groupServicesByCategory(filtered);
      setCategorizedServices(groupedByCategory);
    }
  }, [sortedServices, searchTerm, categoryFilter]);

  // Group services by their category
  const groupServicesByCategory = (services) => {
    const grouped = {};
    
    services.forEach(service => {
      const category = service.category || "Uncategorized";
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      grouped[category].push(service);
    });
    
    return grouped;
  };

  // Handle sorting
  const handleSort = (option) => {
    const value = option.value;
    const sorted = [...filteredServices].sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return value === "highToMin" ? priceB - priceA : priceA - priceB;
    });
    setFilteredServices(sorted);
    
    // Update categorized services after sorting
    const groupedByCategory = groupServicesByCategory(sorted);
    setCategorizedServices(groupedByCategory);
  };

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return "";
    // Expected format: "HH:mm:ss"
    const [hours, minutes] = duration.split(":").map(Number);
    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
  };

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(parseFloat(price) || 0);
  };

  // Handle service selection
  const handleSelectService = (serviceId, e) => {
    e.stopPropagation();
    router.push(`/service/${serviceId}`);
  };

  // Handle booking
  const handleBookService = (service, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    // Store selected service in localStorage or use context API
    // This is a simple way to pass the selected service to the booking page
    localStorage.setItem('selectedService', JSON.stringify(service));
    
    // Redirect to booking page - start at step 2 since service is already selected
    router.push('/booking?step=2');
    
    showToast(`Booking ${service.name}...`, "success");
  };

  // Get unique categories from services
  const categories = services 
    ? [...new Set(services.map(service => service.category).filter(Boolean))]
    : [];

  // Setup pagination
  const paginate = usePagination(filteredServices, 12);

  // Toggle description expansion
  const toggleDescription = (serviceId, e) => {
    e.stopPropagation();
    setExpandedDescriptions(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Check if description is expanded
  const isDescriptionExpanded = (serviceId) => {
    return !!expandedDescriptions[serviceId];
  };

  // Create a function to render placeholder cards
  const renderPlaceholderCards = () => {
    return (
      <div className="services-grid">
        {Array(6).fill().map((_, index) => (
          <div key={index} className="service-card service-card--placeholder">
            <div className="placeholder-image"></div>
            <div className="service-card__info">
              <div className="placeholder-text placeholder-title"></div>
              <div className="placeholder-text placeholder-description"></div>
              <div className="placeholder-text placeholder-description"></div>
              <div className="service-card__bottom">
                <div className="placeholder-text placeholder-price"></div>
                <div className="placeholder-button"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render service card
  const renderServiceCard = (service) => (
    <div 
      key={service.id} 
      className="service-card"
      // onClick={(e) => handleSelectService(service.id, e)}
    >
      <div className="service-card__image">
        <img 
          src={service.imgUrl || "/assets/img/services/placeholder.jpg"} 
          alt={service.name || "Service"} 
          onError={(e) => {
            e.target.src = "/assets/img/services/placeholder.jpg";
          }}
        />
      </div>
      <div className="service-card__info">
        <h3 className="service-card__name">{service.name || "Unnamed Service"}</h3>
        {service.category && (
          <p className="service-card__category">{service.category}</p>
        )}
        <div className={`service-card__description ${isDescriptionExpanded(service.id) ? 'expanded' : ''}`}>
          {service.description || "No description available."}
        </div>
        {service.description && service.description.length > 120 && (
          <button 
            className="service-card__toggle-btn"
            onClick={(e) => toggleDescription(service.id, e)}
          >
            {isDescriptionExpanded(service.id) ? (
              <>View Less <FaAngleUp className="icon" /></>
            ) : (
              <>View More <FaAngleDown className="icon" /></>
            )}
          </button>
        )}
        <div className="service-card__bottom">
          <div className="service-card__details">
            <span className="service-card__price">{formatPrice(service.price)}</span>
            {service.duration && (
              <span className="service-card__duration">
                <FaClock className="icon" />
                {formatDuration(service.duration)}
              </span>
            )}
          </div>
          <div className="service-card__actions">
            <button 
              className="service-card__btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBookService(service, e);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Update loading state to include placeholder cards
  if (loading) {
    return (
      <div className="service">
        <div className="wrapper">
          <div className="shop-content">
            <div className="shop-aside">
              {/* Placeholder sidebar */}
            </div>
            <div className="shop-main">
              <div className="service-list__loading">
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
                <p className="loading-text">Loading services...</p>
              </div>
              {renderPlaceholderCards()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="service">
        <div className="wrapper">
          <div className="service-list__error">
            <div className="error-icon">
              <span className="error-x">×</span>
            </div>
            <h3>Unable To Load Services</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => getAllServices()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <!-- BEGIN SERVICE --> */}
      <div className="shop service">
        <div className="wrapper">
          <div className="shop-content">
            {/* <!-- Service Aside --> */}
            <div className="shop-aside">
              <div className="box-field box-field__search">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search services"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
              </div>
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Categories</span>
                <ul>
                  <li>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCategoryFilter("");
                      }}
                      className={categoryFilter === "" ? "active" : ""}
                    >
                      All Services ({services.length})
                    </a>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoryFilter(category);
                        }}
                        className={categoryFilter === category ? "active" : ""}
                      >
                        {category} ({services.filter(s => s.category === category).length})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* <!-- Service Main --> */}
            <div className="shop-main">
              <div className="shop-main__filter">
                <div className="shop-main__select">
                  <Dropdown
                    options={options}
                    className="react-dropdown"
                    onChange={handleSort}
                    value={options[0]}
                    placeholder="Sort by price"
                  />
                </div>
                <div className="shop-main__results">
                  {filteredServices.length} services found
                </div>
              </div>
              <div className="shop-main__items">
                {filteredServices.length === 0 ? (
                  <div className="service-list__empty">
                    <h3>No Services Found</h3>
                    <p>We couldn't find any services matching your search criteria.</p>
                    <button 
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  Object.entries(categorizedServices).map(([category, categoryServices]) => (
                    <div className="service-category" key={category}>
                      <h2 className="service-category__title">{category}</h2>
                      <div className="services-grid">
                        {categoryServices.map(renderServiceCard)}
                        {/* Add additional placeholders to maintain proper grid layout */}
                        {categoryServices.length === 1 && <div className="service-card service-card--empty"></div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {paginate?.maxPage > 1 && (
                <PagingList
                  currentPage={paginate.currentPage}
                  maxPage={paginate.maxPage}
                  next={paginate.next}
                  prev={paginate.prev}
                  jump={paginate.jump}
                />
              )}
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
        <img
          className="shop-decor js-img"
          src="/assets/img/shop-decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- SERVICE EOF   --> */}
    </div>
  );
};

export default Service; 