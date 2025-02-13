import { Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation

const CheckCartIdAndWishListId = () => {
  const navigation = useNavigation(); // Get navigation instance

  const checkCartAndWishlistIds = async () => {
    try {
      const cartId = await AsyncStorage.getItem("cartId"); // Retrieve cartId from AsyncStorage
      const wishlistId = await AsyncStorage.getItem("wishlistId"); // Retrieve wishlistId from AsyncStorage

      const numericCartId = parseInt(cartId, 10); // Convert cartId to a number
      const numericWishlistId = parseInt(wishlistId, 10); // Convert wishlistId to a number

      // Check if either cartId or wishlistId is null, undefined, or invalid
      if (
        !cartId ||
        isNaN(numericCartId) ||
        !wishlistId ||
        isNaN(numericWishlistId)
      ) {
        // console.error("Cart ID or Wishlist ID is missing or invalid");
        // Redirect to landing page if any ID is missing or invalid
        navigation.navigate("LandingPage"); // Adjust to your actual route name
        return;
      }

      // If both IDs are valid, you can proceed with your logic here
      // console.log("Cart ID and Wishlist ID are valid.");
    } catch (error) {
      console.error("Failed to retrieve IDs from AsyncStorage:", error);
    }
  };

  // Call the check function when the component mounts
  React.useEffect(() => {
    checkCartAndWishlistIds();
  }, []);

  return (
    <View>
      <Text>Check Cart and Wishlist IDs</Text>
    </View>
  );
};

export default CheckCartIdAndWishListId;
