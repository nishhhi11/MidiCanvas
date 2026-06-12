import { useEffect, useCallback, useRef } from 'react';
import { usePlaybackStore } from '../stores/playbackStore';
import { useMidiStore } from '../stores/midiStore';
import { useMixerStore } from '../stores/useMixerStore';
import { 
  initializeAudio, 
  playMidi, 
  pauseMidi, 
  stopMidi, 
  resumeMidi, 
  getCurrentTime,
  seek,
  setTrackStates,
  setMasterVolume,
  setPlaybackSpeed
} from '../utils/playbackEngine';

export function usePlaybackController() {
  const { midiData } = useMidiStore();
  const { mutedTracks, soloedTracks, masterVolume, trackVolumes } = useMixerStore();
  const { 
    playbackState, setPlaybackState, 
    setCurrentTime, setActiveNotes, 
    isLooping, playbackRate,
    loopStart, loopEnd, isMetronomeOn
  } = usePlaybackStore();
  
  const notes = midiData?.notes || [];
  const requestRef = useRef();

  // Sync mute/solo/volume state instantly to the playback engine
  useEffect(() => {
    setTrackStates(mutedTracks, soloedTracks, trackVolumes);
  }, [mutedTracks, soloedTracks, trackVolumes]);

  // Sync master volume
  useEffect(() => {
    setMasterVolume(masterVolume);
  }, [masterVolume]);

  // Sync playback rate
  useEffect(() => {
    setPlaybackSpeed(playbackRate);
  }, [playbackRate]);

  const handleStop = useCallback(() => {
    stopMidi();
    setCurrentTime(0);
    setActiveNotes([]);
    setPlaybackState('stopped');
  }, [setCurrentTime, setActiveNotes, setPlaybackState]);

  const updateTimeline = useCallback(() => {
    if (playbackState === 'playing') {
      const time = getCurrentTime();
      setCurrentTime(time);
      
      // Check if we've reached the end of the song or loop end
      const maxTime = notes.length > 0 ? Math.max(...notes.map(n => n.time + n.duration)) : 0;
      const effectiveLoopEnd = loopEnd > 0 ? loopEnd : maxTime;

      if (time >= effectiveLoopEnd) {
        if (isLooping) {
          seek(loopStart);
        } else if (time >= maxTime) {
          handleStop();
          return;
        }
      }
      
      // Compute active notes efficiently (ignoring muted tracks)
      const active = notes.filter(n => {
        if (time < n.time || time >= n.time + n.duration) return false;
        if (soloedTracks.size > 0) return soloedTracks.has(n.track);
        return !mutedTracks.has(n.track);
      });
      setActiveNotes(active);

      requestRef.current = requestAnimationFrame(updateTimeline);
    }
  }, [playbackState, notes, isLooping, loopStart, loopEnd, handleStop, mutedTracks, soloedTracks, setCurrentTime, setActiveNotes]);

  useEffect(() => {
    if (playbackState === 'playing') {
      requestRef.current = requestAnimationFrame(updateTimeline);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [playbackState, updateTimeline]);

  const handlePlay = useCallback(async () => {
    if (!notes || notes.length === 0) return;
    
    await initializeAudio();

    if (playbackState === 'paused') {
      resumeMidi();
    } else {
      const tempo = midiData?.tempo || 120;
      const timeSig = midiData?.timeSignature || "4/4";
      const duration = midiData?.duration || 0;
      playMidi(notes, tempo, timeSig, duration, isMetronomeOn);
    }
    setPlaybackState('playing');
  }, [notes, playbackState, setPlaybackState, midiData, isMetronomeOn]);

  const handlePause = useCallback(() => {
    pauseMidi();
    setPlaybackState('paused');
  }, [setPlaybackState]);

  const handleSeek = useCallback((time) => {
    seek(time);
    setCurrentTime(time);
    // Let the RAF loop update the active notes instantly on next frame
  }, [setCurrentTime]);

  return { handlePlay, handlePause, handleStop, handleSeek };
}

