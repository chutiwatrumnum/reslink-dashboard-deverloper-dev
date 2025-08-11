import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Mock function to prevent 404 errors during development
export const getJuristicRoleQuery = () => {
  return useQuery({
    queryKey: ["juristicRoles"],
    queryFn: async () => {
      try {
        // Try to fetch real data first
        const response = await axios.get("/juristic/roles");
        return response.data;
      } catch (error) {
        console.warn("API call failed, using mock data:", error);
        // Return mock data if API fails
        return {
          data: [
            { id: 1, name: "President", description: "Board President" },
            { id: 2, name: "Vice President", description: "Board Vice President" },
            { id: 3, name: "Secretary", description: "Board Secretary" },
            { id: 4, name: "Treasurer", description: "Board Treasurer" },
            { id: 5, name: "Member", description: "Board Member" }
          ]
        };
      }
    },
    // Don't retry on failure to avoid repeated 404s
    retry: false,
    // Use stale time to avoid frequent refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 