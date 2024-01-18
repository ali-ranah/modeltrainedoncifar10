// theme.js

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  buttonsend: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sendContainer: {
    alignItems: 'center',
    marginBottom: '15%',  // Adjust this margin as needed
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
    position: 'absolute',
    bottom: '20%',  // Adjust this position as needed
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
