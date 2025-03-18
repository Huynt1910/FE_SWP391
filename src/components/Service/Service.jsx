import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Slider from "rc-slider";
import Dropdown from "react-dropdown";
import { FaSearch, FaSpinner, FaCalendarAlt, FaAngleDown, FaAngleUp, FaLock } from "react-icons/fa";
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
  const { addToCart } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortedServices, setSortedServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        // Don't call redirectToLogin here as it will cause error
        // We'll handle this in the render phase
        return false;
      }
      return true;
    };
    
    const authenticated = checkAuth();
    setIsAuthChecked(authenticated);
    
    if (authenticated) {
      console.log("Service: Fetching services...");
      getAllServices().then(result => {
        console.log("Service: Services fetched, count:", result?.length || 0);
      });
    }
  }, []);

  // Update sorted services when data changes
  useEffect(() => {
    if (services && services.length > 0) {
      console.log("Services data:", services);
      // Make sure we have price data
      const sorted = [...services].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceB - priceA; // High to low
      });
      setSortedServices(sorted);
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
    }
  }, [sortedServices, searchTerm, categoryFilter]);

  // Handle sorting
  const handleSort = (value) => {
    if (value === "highToMin") {
      const sorted = [...services].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceB - priceA; // High to low
      });
      setSortedServices(sorted);
    }
    if (value === "minToHigh") {
      const sorted = [...services].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceA - priceB; // Low to high
      });
      setSortedServices(sorted);
    }
  };

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle service selection
  const handleSelectService = (serviceId) => {
    router.push(`/service/${serviceId}`);
  };

  // Toggle description expansion
  const toggleDescription = (serviceId, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setExpandedDescriptions(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
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

  // Show authentication required state
  if (!isAuthChecked) {
    return (
      <div className="service">
        <div className="wrapper">
          <div className="service-list__error">
            <div className="error-icon">
              <FaLock size={24} color="white" />
            </div>
            <h3>Login Required</h3>
            <p>You need to be logged in to view our services.</p>
            <button 
              className="login-button"
              onClick={() => router.push('/login')}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <FaSearch className="icon-search" />
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
                    onChange={(option) => handleSort(option.value)}
                    value={options[0]}
                  />
                </div>
              </div>
              <div className="shop-main__items">
                {paginate?.currentData().length > 0 ? (
                  <div className="services-grid">
                    {paginate?.currentData().map((service) => (
                      <div key={service.id} className="service-card">
                        <div className="service-card__image">
                          <img 
                            src={service.imgUrl || "/assets/img/services/placeholder.jpg"} 
                            alt={service.name || "Service"} 
                          />
                        </div>
                        <div className="service-card__info">
                          <h3 className="service-card__name">{service.name || "Unnamed Service"}</h3>
                          {service.category && service.category !== "General" && (
                            <p className="service-card__category">{service.category}</p>
                          )}
                          <div className="service-card__description-container">
                            <p className="service-card__description" style={{
                              maxHeight: expandedDescriptions[service.id] ? 'none' : '4.5em',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: expandedDescriptions[service.id] ? 'unset' : '3',
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {service.description || "No description available."}
                            </p>
                            {service.description && service.description.length > 100 && (
                              <button 
                                className="service-card__book-btn"
                                onClick={(e) => toggleDescription(service.id, e)}
                              >
                                {expandedDescriptions[service.id] 
                                  ? <>View less <FaAngleUp className="icon" /></> 
                                  : <>View more <FaAngleDown className="icon" /></>}
                              </button>
                            )}
                          </div>
                          <div className="service-card__bottom">
                            <span className="service-card__price">{formatPrice(service.price || 0)}</span>
                            <button 
                              className="service-card__book-btn"
                              onClick={(e) => handleBookService(service, e)}
                            >
                              <FaCalendarAlt className="icon" />
                              <span>Book Now</span>
                            </button>
                          </div>
                        </div>
                        <div className="service-card__overlay" onClick={() => handleSelectService(service.id)}></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="service-list__empty">
                    <h3>No Services Found</h3>
                    <p>We couldn't find any services matching your search criteria.</p>
                    <button 
                      className="back-button"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
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