import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useListAllTherapist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // Transform therapist data to match service structure
  const transformTherapistToService = (therapist) => {
    return {
      id: therapist.id,
      name: therapist.fullName,
      description: `${therapist.fullName} is a skincare specialist with ${therapist.yearExperience} years of experience.`,
      price: calculatePrice(therapist.yearExperience), // Price based on experience
      duration: calculateDuration(therapist.yearExperience), // Duration based on experience
      category: getCategoryByExperience(therapist.yearExperience),
      image: therapist.imgUrl,
      status: therapist.status,
      // Additional therapist-specific fields
      therapistInfo: {
        email: therapist.email,
        phone: therapist.phone,
        address: therapist.address,
        gender: therapist.gender,
        yearExperience: therapist.yearExperience,
        role: therapist.role
      }
    };
  };

  // Helper function to calculate price based on experience
  const calculatePrice = (experience) => {
    const basePrice = 500000; // Base price in VND
    const experienceMultiplier = 100000; // Additional amount per year of experience
    return basePrice + (experience * experienceMultiplier);
  };

  // Helper function to calculate duration based on experience
  const calculateDuration = (experience) => {
    const baseDuration = 60; // Base duration in minutes
    const experienceBonus = Math.floor(experience / 3) * 15; // Additional 15 minutes for every 3 years
    return Math.min(baseDuration + experienceBonus, 120); // Cap at 120 minutes
  };

  // Helper function to get category based on experience
  const getCategoryByExperience = (experience) => {
    if (experience >= 5) return "Advanced";
    if (experience >= 3) return "Intermediate";
    return "Basic";
  };

  // Get all therapists
  const getAllTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching all therapists...");
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_THERAPISTS,
        options: { 
          preventRedirect: true,
          requiresAuth: false
        }
      });
      
      console.log("Raw API Response for getAllTherapists:", JSON.stringify(response));
      
      // Process and transform the response data
      if (response && response.success === true && response.result) {
        const transformedData = response.result.map(transformTherapistToService);
        console.log("Transformed therapist data:", transformedData);
        setData(transformedData);
        return transformedData;
      } else if (Array.isArray(response)) {
        const transformedData = response.map(transformTherapistToService);
        setData(transformedData);
        return transformedData;
      } else if (response && response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map(transformTherapistToService);
        setData(transformedData);
        return transformedData;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setError(error.message || "Failed to fetch therapists");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    getAllTherapists
  };
};

export default useListAllTherapist; 