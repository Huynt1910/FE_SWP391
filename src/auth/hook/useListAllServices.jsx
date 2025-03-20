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
      
      console.log("Fetching active services...");
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_SERVICES,
        options: { 
          preventRedirect: true,
          requiresAuth: false,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
      
      console.log("API Response for getActiveServices:", response);
      
      if (response && response.success === true && Array.isArray(response.result)) {
        console.log("Response has result array with length:", response.result.length);
        const mappedServices = response.result.map(service => ({
          id: service.serviceId,
          name: service.serviceName,
          description: service.description,
          price: service.price,
          imgUrl: service.imgUrl,
          duration: service.duration,
          isActive: service.isActive,
          category: service.category || "General"
        }));
        console.log("Mapped services:", mappedServices);
        setData(mappedServices);
        return mappedServices;
      } else {
        console.error("Unexpected API response format:", JSON.stringify(response, null, 2));
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching active services:", error);
      setError(error.message || "Failed to fetch services");
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
        console.log("Mapped service:", mappedService);
        setData([mappedService]);
        return mappedService;
      } else if (response && response.id || response.serviceId) {
        // Handle case where the response itself is a service object
        const mappedService = mapServiceFields(response);
        console.log("Mapped service (direct):", mappedService);
        setData([mappedService]);
        return mappedService;
      } else {
        console.error("Unexpected API response format:", JSON.stringify(response, null, 2));
        setError("Invalid response format from API");
        return null;
      }
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      setError(error.message || "Failed to fetch service");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map API response fields to component expected fields
  const mapServiceFields = (service) => {
    if (!service) return null;
    
    console.log("Mapping service:", service);
    
    // Handle both camelCase and snake_case field names
    const result = {
      id: service.serviceId || service.service_id || service.id,
      name: service.serviceName || service.service_name || service.name,
      description: service.description || "",
      price: service.price || 0,
      imgUrl: service.imgUrl || service.img_url || service.image || service.imageUrl || null,
      duration: service.duration || null,
      isActive: service.isActive !== undefined ? service.isActive : true,
      // Add category for filtering in Service component
      category: service.category || service.serviceCategory || service.service_category || ""
    };
    
    console.log("Mapped result:", result);
    return result;
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