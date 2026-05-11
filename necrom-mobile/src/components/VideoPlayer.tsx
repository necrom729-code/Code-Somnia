import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Slider,
  Alert
} from 'react-native';
import Video from 'react-native-video';

interface VideoPlayerProps {
  src: string;
  fileName: string;
  onClose: () => void;
}

export default function VideoPlayer({ src, fileName, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffer, setBuffer] = useState(0);
  const videoRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showControls]);

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
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.setVolume(isMuted ? 1 : 0);
    }
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.setVolume(value);
    }
    setIsMuted(value === 0);
  };

  const onSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.seekTo(value);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!src) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText>No video source provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: src }}
        rate={1.0}
        volume={isMuted ? 0 : volume}
        muted={isMuted}
        resizeMode={isFullscreen ? 'cover' : 'contain'}
        style={styles.video}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnd={() => setIsPlaying(false)}
        onLoad={({ duration }) => setDuration(duration)}
        onProgress={({ currentTime, seekableTime }) => {
          setCurrentTime(currentTime);
          setBuffer(seekableTime.end);
        }}
      />
      
      {/* Close button */}
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Time display */}
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>/</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Slider
            minimumValue={0}
            maximumValue={duration}
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
          
          <TouchableOpacity onPress={toggleFullscreen} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{isFullscreen ? '⛶' : '⛷'}</Text>
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
  },
  video: {
    ...StyleSheet.absoluteFillObject,
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
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    flexDirection: 'column',
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    padding: 10,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
});
