import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaStar, FaCalendarAlt, FaCircle, FaUserMd, FaFilter, FaTimes } from "react-icons/fa";
import useListAllTherapist from "@/auth/hook/useListAllTherapist";

const TherapistList = () => {
  const router = useRouter();
  const { loading, error, data: therapists, getAllTherapists } = useListAllTherapist();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState(0);

  // Fetch all therapists on component mount
  useEffect(() => {
    console.log("TherapistList: Fetching therapists...");
    getAllTherapists().then(result => {
      console.log("TherapistList: Therapists fetched, count:", result?.length || 0);
    });
  }, []);

  // Log data changes
  useEffect(() => {
    console.log("TherapistList: Data updated, therapists count:", therapists?.length || 0);
    if (therapists && therapists.length > 0) {
      console.log("Sample therapist data:", therapists[0]);
    }
  }, [therapists]);

  // Filter therapists based on search term and experience
  const filteredTherapists = therapists ? therapists.filter(therapist => {
    // Filter by search term (name or specialization)
    const name = therapist.fullName || therapist.name || "";
    const specialization = therapist.specialization || therapist.specialty || "";
    
    const matchesSearch = searchTerm === "" || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by years of experience
    const experience = therapist.yearsOfExperience || therapist.yearExperience || therapist.experience || 0;
    const matchesExperience = filterExperience === 0 || experience >= filterExperience;
    
    return matchesSearch && matchesExperience;
  }) : [];

  // Handle therapist selection
  const handleSelectTherapist = (therapistId) => {
    router.push(`/booking-service?therapistId=${therapistId}`);
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return "";
    
    // Convert SNAKE_CASE to Title Case
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="therapist-list__loading">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Loading therapists...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    const isAuthError = error.includes("Authentication required");
    
    return (
      <div className="therapist-list__error">
        <div className="error-icon">
          <FaCircle className="error-circle" />
          <span className="error-x">×</span>
        </div>
        <h3>Unable To Load Therapists</h3>
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
            className="retry-button"
            onClick={() => getAllTherapists()}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Render empty state with more helpful message
  if (!loading && (!therapists || therapists.length === 0)) {
    return (
      <div className="therapist-list__empty">
        <p>No therapists are currently available in our system.</p>
        <p>Please check back later or contact customer support for assistance.</p>
        <button 
          className="retry-button"
          onClick={() => getAllTherapists()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render no results state
  if (!loading && filteredTherapists.length === 0) {
    return (
      <div className="therapist-list">
        <div className="therapist-list__filters">
          {/* Search input */}
          <div className="search-input">
            <input
              type="text"
              placeholder="Search by name or specialization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Experience filter */}
          <div className="experience-filter">
            <label>Experience:</label>
            <select 
              value={filterExperience} 
              onChange={(e) => setFilterExperience(Number(e.target.value))}
            >
              <option value={0}>Any</option>
              <option value={1}>1+ years</option>
              <option value={3}>3+ years</option>
              <option value={5}>5+ years</option>
              <option value={10}>10+ years</option>
            </select>
          </div>
        </div>
        
        <div className="therapist-list__no-results">
          <FaFilter size={24} color="#ff4f6f" style={{ marginBottom: '15px' }} />
          <p>No therapists match your search criteria.</p>
          <p>Try adjusting your filters or search term.</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setFilterExperience(0);
            }}
          >
            <FaTimes style={{ marginRight: '8px' }} /> Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-list-container">
      <div className="therapist-list-header">
        <h2>Our Skin Care Specialists</h2>
        <p>Choose from our team of experienced therapists for your skin care consultation</p>
        
        <div className="therapist-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search therapists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="experience-filter">
            <label>Experience:</label>
            <select 
              value={filterExperience} 
              onChange={(e) => setFilterExperience(Number(e.target.value))}
            >
              <option value={0}>All</option>
              <option value={1}>1+ years</option>
              <option value={3}>3+ years</option>
              <option value={5}>5+ years</option>
              <option value={10}>10+ years</option>
            </select>
          </div>
          
          {(searchTerm || filterExperience > 0) && (
            <button 
              className="clear-filters-button"
              onClick={() => {
                setSearchTerm("");
                setFilterExperience(0);
              }}
            >
              <FaTimes size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {filteredTherapists.length > 0 ? (
        <div className="therapist-grid">
          {filteredTherapists.map((therapist) => {
            // Extract therapist properties with fallbacks
            const id = therapist.id || therapist._id || "";
            const name = therapist.fullName || therapist.name || "Unnamed Therapist";
            const image = therapist.image || therapist.avatar || therapist.photo || "/assets/img/therapists/default.jpg";
            const specialization = therapist.specialization || therapist.specialty || "Skin Care Specialist";
            const role = therapist.role || therapist.position || "";
            const experience = therapist.yearsOfExperience || therapist.yearExperience || therapist.experience || 0;
            const rating = therapist.rating || 4.5;
            const bio = therapist.bio || therapist.description || "Specialized in providing exceptional skin care treatments tailored to individual needs.";
            const status = therapist.status || "ACTIVE";
            
            return (
              <div 
                key={id} 
                className={`therapist-card ${status === "INACTIVE" ? "inactive" : ""}`}
              >
                <div className="therapist-image">
                  <img 
                    src={image} 
                    alt={name} 
                  />
                  <div className="therapist-status">
                    <FaCircle 
                      className={status === "ACTIVE" ? "status-active" : "status-inactive"} 
                    />
                    <span>{status === "ACTIVE" ? "Available" : "Unavailable"}</span>
                  </div>
                </div>
                
                <div className="therapist-details">
                  <h3>{name}</h3>
                  
                  <div className="therapist-info">
                    <p className="specialization">{specialization}</p>
                    
                    {role && (
                      <p className="role">
                        <FaUserMd className="role-icon" /> {formatRole(role)}
                      </p>
                    )}
                    
                    <p className="experience">{experience} years experience</p>
                    
                    <div className="rating">
                      {Array(5).fill().map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(rating) ? "star filled" : "star"} 
                        />
                      ))}
                      <span className="rating-value">{rating}</span>
                    </div>
                  </div>
                  
                  <div className="therapist-bio">
                    <p>{bio}</p>
                  </div>
                  
                  <button 
                    className={`book-button ${status === "INACTIVE" ? "disabled" : ""}`}
                    onClick={() => handleSelectTherapist(id)}
                    disabled={status === "INACTIVE"}
                  >
                    <FaCalendarAlt /> {status === "ACTIVE" ? "Book Appointment" : "Currently Unavailable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <p>No therapists found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TherapistList; 