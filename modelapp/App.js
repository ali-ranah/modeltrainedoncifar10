import React, { useEffect, useState } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import Index from './index';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';  // Use ImagePicker instead of MediaLibrary

const App = () => {
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
        if (cameraStatus === 'granted' && mediaLibraryStatus === 'granted') {
          setPermissionsGranted(true);
        } else {
          console.error('Camera or media library permission not granted!');
        }
  
        setPermissionsChecked(true);
      } catch (error) {
        console.error('Error checking permissions:', error.message);
      }
    };
  
    checkPermissions();
  }, []);

  if (!permissionsChecked) {
    // Render a loading indicator or splash screen while checking permissions
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!permissionsGranted) {
    // Render an error message or UI indicating that permissions are not granted
    return (
      <View>
        <Text>Error: Camera or media library permission not granted!</Text>
      </View>
    );
  }

  return <Index />;
};

AppRegistry.registerComponent('YourAppName', () => App);

export default App;
