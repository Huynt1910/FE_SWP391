import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useBookingHook from "@/auth/hook/useBookingHook";
import { showToast } from "@/utils/toast";
import { FaStar, FaCalendarAlt, FaCircle } from "react-icons/fa";

const TherapistList = () => {
  const router = useRouter();
  const bookingHook = useBookingHook();
  
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"

  // Fetch all therapists on component mount
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the hook method to get all therapists
        const data = await bookingHook.getAllTherapists();
        console.log("Therapists data:", data);
        
        if (Array.isArray(data)) {
          setTherapists(data);
        } else {
          console.error("Unexpected API response format:", data);
          setError("Invalid response format from API");
          setTherapists([]);
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setError(`Failed to load therapists: ${err.message || "Unknown error"}`);
        showToast.error("Failed to load therapists. Please try again later.");
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Filter therapists based on search term, experience, and status
  const filteredTherapists = therapists.filter(therapist => {
    const nameMatch = (therapist.fullName || therapist.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const experienceMatch = filterExperience === 0 || 
      (therapist.yearExperience || 0) >= filterExperience;
    
    const statusMatch = 
      filterStatus === "all" || 
      (filterStatus === "active" && therapist.status === "ACTIVE") ||
      (filterStatus === "inactive" && therapist.status === "INACTIVE");
    
    return nameMatch && experienceMatch && statusMatch;
  });

  // Handle booking with a specific therapist
  const handleBookTherapist = (therapist) => {
    if (therapist.status === "INACTIVE") {
      showToast.warning("This therapist is currently unavailable for booking.");
      return;
    }
    
    router.push({
      pathname: "/booking",
      query: { therapistId: therapist.id }
    });
  };

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
          
          <div className="status-filter">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Available</option>
              <option value="inactive">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading therapists...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredTherapists.length > 0 ? (
        <div className="therapist-grid">
          {filteredTherapists.map((therapist) => (
            <div 
              key={therapist.id} 
              className={`therapist-card ${therapist.status === "INACTIVE" ? "inactive" : ""}`}
            >
              <div className="therapist-image">
                <img 
                  src={therapist.image || "/assets/img/therapists/default.jpg"} 
                  alt={therapist.fullName || therapist.name || "Therapist"} 
                />
                <div className="therapist-status">
                  <FaCircle 
                    className={therapist.status === "ACTIVE" ? "status-active" : "status-inactive"} 
                  />
                  <span>{therapist.status === "ACTIVE" ? "Available" : "Unavailable"}</span>
                </div>
              </div>
              
              <div className="therapist-details">
                <h3>{therapist.fullName || therapist.name || "Unnamed Therapist"}</h3>
                
                <div className="therapist-info">
                  <p className="specialization">{therapist.specialization || "Skin Care Specialist"}</p>
                  <p className="experience">{therapist.yearExperience || 0} years experience</p>
                  
                  <div className="rating">
                    {Array(5).fill().map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(therapist.rating || 4.5) ? "star filled" : "star"} 
                      />
                    ))}
                    <span className="rating-value">{therapist.rating || 4.5}</span>
                  </div>
                </div>
                
                <div className="therapist-bio">
                  <p>{therapist.bio || "Specialized in providing exceptional skin care treatments tailored to individual needs."}</p>
                </div>
                
                <button 
                  className={`book-button ${therapist.status === "INACTIVE" ? "disabled" : ""}`}
                  onClick={() => handleBookTherapist(therapist)}
                  disabled={therapist.status === "INACTIVE"}
                >
                  <FaCalendarAlt /> {therapist.status === "ACTIVE" ? "Book Appointment" : "Currently Unavailable"}
                </button>
              </div>
            </div>
          ))}
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