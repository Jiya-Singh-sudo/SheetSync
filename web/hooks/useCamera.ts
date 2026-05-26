import { useState, useEffect, useCallback } from 'react';
import { CameraPermission } from '@/types/scanner';

export function useCamera() {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [permissionState, setPermissionState] = useState<CameraPermission>('pending');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);

  const updateDevicesList = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
    } catch (err) {
      console.error('Error enumerating video devices:', err);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setPermissionState('pending');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the temporary permission stream immediately
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      await updateDevicesList();
    } catch (err) {
      console.error('Camera permission denied or failed:', err);
      setPermissionState('denied');
    }
  }, [updateDevicesList]);

  // Try to auto-detect permission on mount
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      setPermissionState('denied');
      return;
    }

    navigator.mediaDevices.enumerateDevices()
      .then(deviceList => {
        const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
        // If camera labels are filled, the user has already granted permission.
        const hasLabels = videoDevices.some(d => d.label && d.label.length > 0);
        if (hasLabels) {
          setPermissionState('granted');
          setDevices(videoDevices);
        } else {
          setPermissionState('pending');
        }
      })
      .catch(() => {
        setPermissionState('pending');
      });
  }, []);

  const switchCamera = useCallback(() => {
    if (devices.length <= 1) {
      // Fallback: swap facing mode directly
      setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
      setActiveDeviceId(undefined);
      return;
    }

    // Move to the next camera index
    const currentIndex = devices.findIndex(d => d.deviceId === activeDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    setActiveDeviceId(nextDevice.deviceId);
    
    // Clear facingMode constraints if using exact deviceId
    if (nextDevice.deviceId) {
      setFacingMode(undefined as any);
    }
  }, [devices, activeDeviceId]);

  return {
    facingMode,
    setFacingMode,
    permissionState,
    setPermissionState,
    devices,
    activeDeviceId,
    setActiveDeviceId,
    requestPermission,
    switchCamera,
  };
}
