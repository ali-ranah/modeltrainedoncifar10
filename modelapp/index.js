import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { styles } from './theme';

const Index = () => {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(cameraStatus);

        if (cameraStatus !== 'granted') {
          Alert.alert(
            'Permission Issue',
            'Camera permission not granted! Please enable permissions in your device settings.'
          );
        }

        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setMediaLibraryPermission(mediaLibraryStatus);

        if (mediaLibraryStatus !== 'granted') {
          console.warn('Media library permission not granted. You may not be able to pick images from the gallery.');
        }
      } catch (error) {
        console.error('Error requesting permissions:', error.message);
      }
    };

    requestPermissions();
  }, []);

  const toggleCameraType = () => {
    setType((current) => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
  };

  const takePicture = async () => {
    try {
      if (cameraPermission === 'granted') {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        setCapturedImage(photo.uri);
        console.log('Picture taken:', photo.uri);
      } else {
        console.error('Camera permission not granted!');
      }
    } catch (error) {
      console.error('Error taking picture:', error.message);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      if (mediaLibraryPermission === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [6, 5],
          quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
          setCapturedImage(result.assets[0].uri);
          console.log('Image picked from gallery:', result.assets[0].uri);
        }
      } else {
        console.error('Media library permission not granted!');
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error.message);
    }
  };

  const sendImageToBackend = async () => {
    try {
      if (!capturedImage) {
        Alert.alert('Error', 'No image to send.');
        return;
      }

      setLoading(true);

      const apiUrl = 'http://192.168.100.46:5000/predict_image';

      // Convert the image to base64
      const base64Image = await convertImageToBase64(capturedImage);

      // Send base64-encoded image as JSON
      const response = await axios.post(apiUrl, { image: base64Image }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Local Server Response:', response.data);

      // Set the prediction result in the state
      setPredictionResult(response.data.predicted_class);
    } catch (error) {
      console.error('Error sending image to local server:', error.message);
      if (error.response) {
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        console.error('No response received. Check your server:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.replace('data:', '').replace(/^.+,/, ''));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error.message);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <>
          <Image source={{ uri: capturedImage }} style={[styles.camera, { resizeMode: 'center' }]} />
          {predictionResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Prediction Result: {predictionResult}</Text>
            </View>
          )}
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.sendContainer}>
                <TouchableOpacity style={styles.buttonsend} onPress={sendImageToBackend}>
                  <Text style={styles.text}>Send</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      ) : (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
              <Text style={styles.text}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
};

export default Index;
