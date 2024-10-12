import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backArrow: {
    position: 'absolute',
    top: 80, // Adjust this to move the arrow down further
    left: 20,
    zIndex: 1, // Ensures the back arrow is above other elements
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 95, // Added margin to create space below the arrow
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 30,
    backgroundColor: '#F9F9F9',
    marginBottom:13,
  },
  cardTitle: {
    color: '#A8E27D',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    marginRight: 8,
    marginLeft:9
  },
  value: {
    fontSize: 9,
    marginRight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rescheduleButton: {
    backgroundColor: '#ECF8DB',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    borderWidth:1,
    borderColor:"#A3D65C"
  },
  cancelButton: {
    backgroundColor: '#FFBDCB',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    borderWidth:1,
    borderColor:"#FC5275"
  },
  buttonTextRE: {
    color: "#A3D65C",
    fontSize: 11,
    fontWeight: 'bold',
  },
  buttonTextCA: {
    color: "#FC5275",
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default styles;
