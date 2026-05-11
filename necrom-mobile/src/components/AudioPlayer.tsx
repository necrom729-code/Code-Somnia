import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Slider,
  ActivityIndicator
} from 'react-native';
import Sound from 'react-native-sound';

interface AudioPlayerProps {
  src: string;
  fileName: string;
  onClose: () => void;
}

export default function AudioPlayer({ src, fileName, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const soundRef = useRef<any>(null);

  useEffect(() => {
    if (!src) return;
    
    const sound = new Sound(src, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
        setIsLoading(false);
        return;
      }
      
      // Loaded successfully
      sound.getDuration((dur) => {
        setDuration(dur);
        setIsLoading(false);
      });
      
      soundRef.current = sound;
    });
    
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [src]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play((success) => {
        if (success) {
          setIsPlaying(true);
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (soundRef.current) {
      soundRef.current.setVolume(isMuted ? 0 : volume);
    }
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    if (soundRef.current) {
      soundRef.current.setVolume(isMuted ? 0 : value);
    }
  };

  const onSeek = (value: number) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(value);
      setCurrentTime(value);
    }
  };

  useEffect(() => {
    if (soundRef.current && isPlaying) {
      soundRef.current.getCurrentTime((time) => {
        setCurrentTime(time);
      });
    }
  }, [isPlaying]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading audio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Close button */}
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Album art placeholder */}
      <View style={styles.albumArt}>
        <Text style={styles.albumArtText}>🎵</Text>
      </View>
      
      {/* File info */}
      <View style={styles.fileInfo}>
        <Text style={styles.fileNameText}>{fileName}</Text>
        <Text style={styles.fileDetailsText}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
      </View>
      
      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Progress slider */}
        <View style={styles.progressContainer}>
          <Slider
            minimumValue={0}
            maximumValue={duration > 0 ? duration : 1}
            value={currentTime}
            step={1}
            minimumTrackTintColor="#00d4ff"
            maximumTrackTintColor="rgba(255,255,255,0.2)"
            thumbTintColor="#00d4ff"
            onValueChange={onSeek}
          />
        </View>
        
        {/* Control buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity onPress={togglePlay} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{isMuted ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => { /* Volume down - simplified */ }} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>-</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => { /* Volume up - simplified */ }} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
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
  albumArt: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  albumArtText: {
    fontSize: 48,
    color: '#a29bfe',
  },
  fileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  fileNameText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  fileDetailsText: {
    color: '#a0c8e0',
    fontSize: 16,
  },
  controlsContainer: {
    width: '100%',
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 25,
    minWidth: 50,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  loadingText: {
    color: '#a0c8e0',
    marginTop: 20,
    fontSize: 16,
  },
});
