import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Slider from "rc-slider";
import Dropdown from "react-dropdown";
import { FaSearch, FaSpinner, FaShoppingCart } from "react-icons/fa";
import useListAllServices from "@/auth/hook/useListAllServices";
import { PagingList } from "@components/shared/PagingList/PagingList";
import { usePagination } from "@components/utils/Pagination/Pagination";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

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
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortedServices, setSortedServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  // Fetch all services on component mount
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
      // Make sure we have price data
      const sorted = [...services].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceB - priceA; // High to low
      });
      setSortedServices(sorted);
    }
  }, [services]);

  // Filter services based on search, price, and category
  useEffect(() => {
    if (sortedServices.length > 0) {
      const filtered = sortedServices.filter(service => {
        // Filter by search term
        const name = service.name || "";
        const description = service.description || "";
        const matchesSearch = searchTerm === "" || 
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by price
        const price = service.price || 0;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        
        // Filter by category
        const category = service.category || "";
        const matchesCategory = categoryFilter === "" || category.toLowerCase() === categoryFilter.toLowerCase();
        
        return matchesSearch && matchesPrice && matchesCategory;
      });
      
      setFilteredServices(filtered);
    }
  }, [sortedServices, searchTerm, priceRange, categoryFilter]);

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

  // Handle service selection
  const handleSelectService = (serviceId) => {
    router.push(`/service/${serviceId}`);
  };

  // Handle adding to cart
  const handleAddToCart = (service, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    addToCart(service);
    toast.success(`${service.name} added to cart!`);
  };

  // Get unique categories from services
  const categories = services 
    ? [...new Set(services.map(service => service.category).filter(Boolean))]
    : [];

  // Get max price for range slider
  const maxPrice = services 
    ? Math.max(...services.map(service => service.price || 0)) + 100
    : 1000;

  // Setup pagination
  const paginate = usePagination(filteredServices, 9);

  // Render loading state
  if (loading) {
    return (
      <div className="service-list__loading">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Loading services...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
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
                      All Services <span>({services?.length || 0})</span>
                    </a>
                  </li>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoryFilter(category);
                        }}
                        className={categoryFilter === category ? "active" : ""}
                      >
                        {category} <span>({services?.filter(s => s.category === category).length || 0})</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Price</span>
                <div className="range-slider">
                  <Range
                    min={0}
                    max={maxPrice}
                    defaultValue={[0, maxPrice]}
                    value={priceRange}
                    onChange={setPriceRange}
                    allowCross={false}
                  />
                  <div className="range-slider__values">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
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
                          <p className="service-card__description">{service.description || "No description available."}</p>
                          {service.duration && (
                            <p className="service-card__duration">
                              <span className="duration-label">Duration:</span> {service.duration}
                            </p>
                          )}
                          <div className="service-card__bottom">
                            <span className="service-card__price">${service.price || 0}</span>
                            <div className="service-card__actions">
                              <button 
                                className="service-card__btn"
                                onClick={() => handleSelectService(service.id)}
                              >
                                View Details
                              </button>
                              <button 
                                className="service-card__cart-btn"
                                onClick={(e) => handleAddToCart(service, e)}
                              >
                                <FaShoppingCart />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-services">
                    <p>No services found matching your criteria.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setPriceRange([0, maxPrice]);
                        setCategoryFilter("");
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* <!-- PAGINATE LIST --> */}
              {filteredServices.length > 0 && (
                <PagingList paginate={paginate} />
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