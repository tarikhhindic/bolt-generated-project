import React, { useEffect, useRef, useState } from 'react';
    import AudioEngine from './audioEngine';

    interface CompactPlayerProps {
      audioEngine: AudioEngine;
    }

    const CompactPlayer: React.FC<CompactPlayerProps> = ({ audioEngine }) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawWaveform = () => {
          if (!waveformData) return;

          const bufferLength = waveformData.length;
          const width = canvas.width;
          const height = canvas.height;

          ctx.clearRect(0, 0, width, height);

          ctx.strokeStyle = '#4299e1';
          ctx.beginPath();

          for (let i = 0; i < bufferLength; i++) {
            const x = (i / bufferLength) * width;
            const y = (waveformData[i] / 255) * height;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        };

        const interval = setInterval(() => {
          setWaveformData(audioEngine.getWaveformData());
        }, 100);

        drawWaveform();

        return () => {
          clearInterval(interval);
        };
      }, [waveformData, audioEngine]);

      const handlePlayPause = () => {
        if (isPlaying) {
          audioEngine.pause();
        } else {
          audioEngine.play();
        }
        setIsPlaying(!isPlaying);
      };

      const handleAlwaysOnTop = () => {
        setIsAlwaysOnTop(!isAlwaysOnTop);
        // Implement always-on-top logic here
      };

      const handleKeyboardShortcuts = (event: KeyboardEvent) => {
        if (event.key === ' ') {
          handlePlayPause();
        }
      };

      useEffect(() => {
        window.addEventListener('keydown', handleKeyboardShortcuts);
        return () => {
          window.removeEventListener('keydown', handleKeyboardShortcuts);
        };
      }, [isPlaying]);

      return (
        <div className={`fixed bottom-0 right-0 m-4 p-2 bg-gray-800 text-white rounded shadow-lg ${isAlwaysOnTop ? 'z-50' : ''}`}>
          <canvas ref={canvasRef} width={200} height={50} className="mb-2" />
          <div className="flex justify-between items-center">
            <button onClick={handlePlayPause} className="px-2 py-1 bg-primary rounded">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={handleAlwaysOnTop} className="px-2 py-1 bg-secondary rounded">
              {isAlwaysOnTop ? 'Disable Always-on-Top' : 'Enable Always-on-Top'}
            </button>
          </div>
        </div>
      );
    };

    export default CompactPlayer;
