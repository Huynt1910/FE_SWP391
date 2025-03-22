import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaStar, FaCalendarAlt, FaCircle, FaUserMd, FaFilter, FaTimes } from "react-icons/fa";
import useListAllTherapist from "@/auth/hook/useListAllTherapist";

const TherapistList = () => {
  const router = useRouter();
  const { loading, error, data: therapists, getAllTherapists } = useListAllTherapist();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState(0);

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

  // Add a helper function to normalize Vietnamese text for searching
  const normalizeVietnamese = (str) => {
    if (!str) return '';
    
    // First, clean up any Unikey special characters that might appear during typing
    let cleaned = str.replace(/·/g, ''); // Remove Unikey dot marker
    cleaned = cleaned.replace(/\s+/g, ' ').trim(); // Normalize spaces
    
    // Replace Vietnamese characters with their non-accented equivalents
    return cleaned
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[đĐ]/g, d => d === 'đ' ? 'd' : 'D'); // Replace Vietnamese d/D
  };

  // Filter therapists based on search term and experience
  const filteredTherapists = therapists ? therapists.filter(therapist => {
    // Filter by search term (prioritize fullName)
    const fullName = therapist.fullName || therapist.name || "";
    const specialization = therapist.specialization || therapist.specialty || "";
    
    // Clean and normalize search term and therapist data for better Vietnamese search
    const normalizedSearchTerm = normalizeVietnamese(searchTerm.toLowerCase());
    const normalizedFullName = normalizeVietnamese(fullName.toLowerCase());
    const normalizedSpecialization = normalizeVietnamese(specialization.toLowerCase());
    
    // Split search term into words for partial matching
    const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
    
    // Check if all search words are found in the fullName
    const matchesFullName = searchTerm === "" || 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchWords.length > 0 && searchWords.every(word => normalizedFullName.includes(word)));
    
    // Check if all search words are found in the specialization
    const matchesSpecialization = searchTerm === "" || 
      specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchWords.length > 0 && searchWords.every(word => normalizedSpecialization.includes(word)));
    
    const matchesSearch = matchesFullName || matchesSpecialization;
    
    // Filter by years of experience
    const experience = therapist.yearsOfExperience || therapist.yearExperience || therapist.experience || 0;
    const matchesExperience = filterExperience === 0 || experience >= filterExperience;
    
    return matchesSearch && matchesExperience;
  }) : [];

  // Handle therapist selection
  const handleSelectTherapist = (therapistId) => {
    router.push(`/booking`);
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterExperience(0);
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
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by therapist name..."
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
            onClick={clearFilters}
          >
            <FaTimes style={{ marginRight: '8px' }} /> Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-list-container">
      <div className="therapist-header">
        <h2 className="therapist-header__title">Our Skin Care Specialists</h2>
        <p className="therapist-header__subtitle">Choose from our team of experienced therapists for your skin care consultation</p>
        
        <div className="therapist-filters">
          <div className="therapist-filters__search">
            <input
              type="text"
              placeholder="Search by therapist name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="therapist-filters__select">
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
              onClick={clearFilters}
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
            
            // Improved image path handling - include imgUrl in the options
            let image = therapist.imgUrl || therapist.image || therapist.avatar || therapist.photo || "/assets/img/therapists/default.jpg";
            
            // Log the image URL for debugging
            console.log(`Therapist ${name} image URL:`, image);
            
            const specialization = therapist.specialization || therapist.specialty || "Skin Care Specialist";
            const role = therapist.role || therapist.position || "";
            const experience = therapist.yearsOfExperience || therapist.yearExperience || therapist.experience || 0;
            // const rating = therapist.rating || 4.5;
            const bio = therapist.bio || therapist.description || "Specialized in providing exceptional skin care treatments tailored to individual needs.";
            const status = therapist.status;
            const isActive = status === true || status === "ACTIVE";
            
            return (
              <div 
                key={id} 
                className={`therapist-card ${!isActive ? "inactive" : ""}`}
              >
                <div className="therapist-image">
                  <img 
                    src={image} 
                    alt={name}
                    onError={(e) => {
                      console.error(`Failed to load image for ${name}:`, image);
                      e.target.onerror = null;
                      e.target.src = "/assets/img/therapists/default.jpg";
                    }}
                  />
                  <div className="therapist-status">
                    <FaCircle 
                      className={isActive ? "status-active" : "status-inactive"} 
                    />
                    <span>{isActive ? "Available" : "Unavailable"}</span>
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
                    
                    {/* <p className="experience">{experience} years experience</p> */}
                    
                    {/* <div className="rating">
                      {Array(5).fill().map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(rating) ? "star filled" : "star"} 
                        />
                      ))}
                      <span className="rating-value">{rating}</span>
                    </div> */}
                  </div>
                  
                  <div className="therapist-bio">
                    <p>{bio}</p>
                  </div>
                  
                  <button 
                    className={`book-button ${!isActive ? "disabled" : ""}`}
                    onClick={() => handleSelectTherapist(id)}
                    disabled={!isActive}
                  >
                    <FaCalendarAlt /> {isActive ? "Book Appointment" : "Currently Unavailable"}
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