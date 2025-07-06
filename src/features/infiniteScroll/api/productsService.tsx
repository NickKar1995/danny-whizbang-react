import type { ApiResponse } from '../types/ApiResponse';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const fetchProducts = async (page = 1, limit = 19): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${baseUrl}?limit=${limit}&skip=${(page - 1) * limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};
