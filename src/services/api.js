import axios from 'axios';

const API_URL = 'https://www.api.buildcores.com/api/official/database/parts';

// Function to search for PC cases
export const searchPCCases = async (searchQuery = '', limit = 20, skip = 0) => {
  try {
    // Prepare the request payload
    const payload = {
      part_category: 'PCCase',
      limit: parseInt(limit),
      skip: parseInt(skip),
      sort: 0,
      filters: [],
      compatibility_build: '67da21d39e52e99a0f120133',
      show_disabled_interactive_models: true,
      show_interactive_first: false
    };
    
    // Only add search_query if it's not empty
    if (searchQuery && searchQuery.trim() !== '') {
      payload.search_query = searchQuery.trim();
    }
    
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Log response info for debugging
    console.log(`Fetched ${response.data.data?.length || 0} of ${response.data.totalParts || 0} total parts`);
    console.log(`Pagination: skip=${skip}, limit=${limit}, search="${searchQuery || 'none'}"`);
    
    return response.data;
  } catch (error) {
    console.error('Error searching PC cases:', error);
    throw error;
  }
}; 