import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../api/repositories/foodRepository";

// Fetch all foods
export const fetchFoods = async () => {
  try {
    const response = await getFoods();
    return response.data;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
};

// Fetch a specific food by ID
export const fetchFoodById = async (id) => {
  try {
    const response = await getFoodById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching food by ID ${id}:`, error);
    throw error;
  }
};

// Create a new food
export const createNewFood = async (data) => {
  try {
    const response = await createFood(data);
    return response.data;
  } catch (error) {
    console.error("Error creating food:", error);
    throw error;
  }
};

// Update a food by ID
export const updateFoodById = async (id, data) => {
  try {
    const response = await updateFood(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating food with ID ${id}:`, error);
    throw error;
  }
};

// Delete a food by ID
export const deleteFoodById = async (id) => {
  try {
    const response = await deleteFood(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting food with ID ${id}:`, error);
    throw error;
  }
};
