import React from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';

interface ImageViewerProps {
  src: string;
  fileName: string;
  onClose: () => void;
}

export default function ImageViewer({ src, fileName, onClose }: ImageViewerProps) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background}>
          <Image 
            source={{ uri: src }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>
      
      {/* Close button */}
      <View style={styles.closeButtonContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      
      {/* File name */}
      <View style={styles.fileNameContainer}>
        <Text style={styles.fileNameText}>{fileName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: '90%',
    height: '90%',
    maxWidth: 400,
    maxHeight: 600,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fileNameContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fileNameText: {
    color: '#ffffff',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
