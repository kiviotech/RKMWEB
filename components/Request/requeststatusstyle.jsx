import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#fff',
  },
  // Common for both cards
  message: {
    fontSize: 10,
    color: '#000',
    marginTop: 10,
  },
  // Rejected request card
  rejectedCard: {
    borderWidth: 1,
   borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  rejectedTitle: {
    color: '#FC5275',
    fontSize: 13,
    fontWeight: 'bold',
  },
  // Expired request card
  expiredCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  expiredTitle: {
    color: '#B6C2D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
