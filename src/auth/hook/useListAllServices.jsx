import { useState } from "react";
import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";

export const useListAllServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // Get all services
  const getAllServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching all services...");
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_SERVICES,
        options: { 
          preventRedirect: true,
          requiresAuth: false // Specify that this endpoint doesn't require authentication
        }
      });
      
      console.log("API Response for getAllServices:", response);
      
      // Process the response data
      if (response && response.success === true && response.result) {
        console.log("Response has result array with length:", response.result.length);
        // Map each service in the result array
        const mappedServices = response.result.map(service => mapServiceFields(service));
        setData(mappedServices);
        return mappedServices;
      } else if (Array.isArray(response)) {
        console.log("Response is an array with length:", response.length);
        // Map each service in the array
        const mappedServices = response.map(service => mapServiceFields(service));
        setData(mappedServices);
        return mappedServices;
      } else if (response && response.data && Array.isArray(response.data)) {
        console.log("Response has data array with length:", response.data.length);
        const mappedServices = response.data.map(service => mapServiceFields(service));
        setData(mappedServices);
        return mappedServices;
      } else if (response && typeof response === 'object') {
        console.log("Response is an object with keys:", Object.keys(response));
        
        // Try to find any array in the response
        for (const key in response) {
          if (Array.isArray(response[key])) {
            console.log(`Found array at key '${key}' with length:`, response[key].length);
            // Map each service in the array
            const mappedServices = response[key].map(service => mapServiceFields(service));
            setData(mappedServices);
            return mappedServices;
          }
        }
        
        // If no array found but response looks like a single service
        if (response.id || response.serviceId) {
          console.log("Response appears to be a single service object");
          const mappedService = mapServiceFields(response);
          const serviceArray = [mappedService];
          setData(serviceArray);
          return serviceArray;
        }
        
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching all services:", error);
      
      // Handle authentication errors differently - don't show auth error for public endpoint
      if (error.status === 401 || error.message?.includes("Authentication required")) {
        console.log("Authentication error caught, but this is a public endpoint");
        setError("Failed to fetch services. Please try again later.");
      } else {
        setError(error.message || "Failed to fetch services");
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get service by ID
  const getServiceById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching service with ID: ${id}`);
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_SERVICE_BY_ID,
        data: { id },
        options: { 
          preventRedirect: true,
          requiresAuth: false // Specify that this endpoint doesn't require authentication
        }
      });
      
      console.log("API Response for getServiceById:", response);
      
      if (response && response.success === true && response.result) {
        // Map API response fields to component expected fields
        const mappedService = mapServiceFields(response.result);
        setData([mappedService]);
        return mappedService;
      } else if (response && response.id) {
        // Map API response fields to component expected fields
        const mappedService = mapServiceFields(response);
        setData([mappedService]);
        return mappedService;
      } else if (response && response.success === false) {
        // Handle error response
        setError(response.message || "Failed to fetch service");
        return null;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return null;
      }
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      
      // Handle authentication errors differently - don't show auth error for public endpoint
      if (error.status === 401 || error.message?.includes("Authentication required")) {
        console.log("Authentication error caught, but this is a public endpoint");
        setError("Failed to fetch service. Please try again later.");
      } else if (error.status === 404) {
        setError("Service not found");
      } else {
        setError(error.message || "Failed to fetch service");
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map API response fields to component expected fields
  const mapServiceFields = (service) => {
    if (!service) return null;
    
    return {
      ...service,
      // Map serviceName to name if it exists and name doesn't
      name: service.name || service.serviceName,
      // Map serviceId to id if it exists and id doesn't
      id: service.id || service.serviceId,
      // Ensure other fields exist
      description: service.description || "",
      price: service.price || 0,
      category: service.category || "",
      imgUrl: service.imgUrl || null,
      duration: service.duration || null
    };
  };

  return {
    loading,
    error,
    data,
    getAllServices,
    getServiceById
  };
};

export default useListAllServices; 