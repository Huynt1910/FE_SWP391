import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaUserMd, FaClock, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import useListAllTherapist from "@/auth/hook/useListAllTherapist";

const TherapistList = () => {
  const router = useRouter();
  const { loading, error, data: therapists, getAllTherapists } = useListAllTherapist();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState("All");

  useEffect(() => {
    getAllTherapists().then(result => {
      // Log the entire therapists data to see its structure
      console.log("Therapists data:", result);
    });
  }, []);

  // Add a helper function to normalize Vietnamese text for searching
  const normalizeVietnamese = (str) => {
    if (!str) return '';
    let cleaned = str.replace(/·/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, d => d === 'đ' ? 'd' : 'D');
  };

  // Filter therapists based on search term and experience
  const filteredTherapists = therapists ? therapists.filter(therapist => {
    const fullName = therapist.fullName || therapist.name || "";
    const specialization = therapist.specialization || therapist.specialty || "";
    // Log each therapist's experience-related fields
    console.log("Therapist experience fields:", {
      name: fullName,
      yearsOfExperience: therapist.yearsOfExperience,
      yearExperience: therapist.yearExperience,
      experience: therapist.experience,
      therapistInfo: therapist.therapistInfo
    });
    
    const experience = therapist.yearsOfExperience || therapist.yearExperience || therapist.experience || 
                      (therapist.therapistInfo && therapist.therapistInfo.yearExperience) || 0;
    
    const normalizedSearchTerm = normalizeVietnamese(searchTerm.toLowerCase());
    const normalizedFullName = normalizeVietnamese(fullName.toLowerCase());
    const normalizedSpecialization = normalizeVietnamese(specialization.toLowerCase());
    
    const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
    
    const matchesName = searchWords.every(word => normalizedFullName.includes(word));
    const matchesSpecialization = searchWords.every(word => normalizedSpecialization.includes(word));
    
    let matchesExperience = true;
    if (filterExperience !== "All") {
      const requiredYears = parseInt(filterExperience);
      matchesExperience = experience >= requiredYears;
    }
    
    return (matchesName || matchesSpecialization) && matchesExperience;
  }) : [];

  // Handle therapist selection
  const handleSelectTherapist = (therapistId) => {
    router.push(`/booking`);
  };

  if (loading) {
    return (
      <div className="therapist-list__loading">
        <div className="loading-icon"></div>
        <p>Loading therapists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="therapist-list__error">
        <div className="error-icon">
          <FaExclamationTriangle size={40} />
        </div>
        <h3>Error Loading Therapists</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => getAllTherapists()}>
          Try Again
        </button>
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
            <FaSearch className="search-icon" />
          </div>
          
          <div className="therapist-filters__select">
            <label>Experience:</label>
            <select 
              value={filterExperience} 
              onChange={(e) => setFilterExperience(e.target.value)}
            >
              <option value="All">All</option>
              <option value="1">1+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
            </select>
          </div>
        </div>
      </div>

      <div className="therapist-grid">
        {filteredTherapists.map((therapist) => {
          const id = therapist.id || therapist._id;
          const name = therapist.fullName || therapist.name || "Unnamed Therapist";
          const image = therapist.imgUrl || therapist.image || therapist.avatar || "/assets/img/therapists/default.jpg";
          const specialization = therapist.specialization || therapist.specialty || "Skin Care Specialist";
          
          // Log the experience value being used
          const experience = therapist.yearsOfExperience || therapist.yearExperience || therapist.experience || 
                           (therapist.therapistInfo && therapist.therapistInfo.yearExperience) || 0;
          console.log(`Experience for ${name}:`, experience);

          return (
            <div key={id} className="therapist-card">
              <div className="therapist-card__image">
                <img 
                  src={image}
                  alt={name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/img/therapists/default.jpg";
                  }}
                />
              </div>
              
              <div className="therapist-card__content">
                <h3 className="therapist-card__name">{name}</h3>
                <p className="therapist-card__specialty">
                  <FaUserMd className="icon" /> {specialization}
                </p>
                <p className="therapist-card__experience">
                  <FaClock className="icon" /> {experience} years of experience
                </p>
                {/* <button 
                  className="therapist-card__button"
                  onClick={() => handleSelectTherapist(id)}
                >
                  Book Appointment
                </button> */}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTherapists.length === 0 && (
        <div className="therapist-list__no-results">
          <p>No therapists found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
          <button onClick={() => {
            setSearchTerm("");
            setFilterExperience("All");
          }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TherapistList; 