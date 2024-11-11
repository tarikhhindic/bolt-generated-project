import React, { useEffect, useRef, useState } from 'react';
    import AudioEngine from './audioEngine';

    interface WaveformViewerProps {
      audioEngine: AudioEngine;
    }

    const WaveformViewer: React.FC<WaveformViewerProps> = ({ audioEngine }) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);
      const [zoomLevel, setZoomLevel] = useState(1);
      const [selectionStart, setSelectionStart] = useState(0);
      const [selectionEnd, setSelectionEnd] = useState(0);
      const [markers, setMarkers] = useState<number[]>([]);
      const [regions, setRegions] = useState<{ start: number; end: number }[]>([]);
      const [playbackPosition, setPlaybackPosition] = useState(0);

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
          const channelHeight = height / 2;

          ctx.clearRect(0, 0, width, height);

          ctx.fillStyle = 'rgba(66, 153, 225, 0.5)';
          ctx.fillRect(selectionStart, 0, selectionEnd - selectionStart, height);

          ctx.strokeStyle = '#4299e1';
          ctx.beginPath();

          for (let i = 0; i < bufferLength; i++) {
            const x = (i / bufferLength) * width * zoomLevel;
            const y = (waveformData[i] / 255) * channelHeight;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();

          markers.forEach(marker => {
            ctx.fillStyle = '#ed8936';
            ctx.fillRect(marker, 0, 2, height);
          });

          regions.forEach(region => {
            ctx.fillStyle = 'rgba(237, 137, 54, 0.5)';
            ctx.fillRect(region.start, 0, region.end - region.start, height);
          });

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(playbackPosition, 0, 2, height);
        };

        const interval = setInterval(() => {
          setWaveformData(audioEngine.getWaveformData());
          setPlaybackPosition((audioEngine.getPlaybackPosition() / audioEngine.getDuration()) * canvas.width);
        }, 100);

        drawWaveform();

        return () => {
          clearInterval(interval);
        };
      }, [waveformData, zoomLevel, selectionStart, selectionEnd, markers, regions, playbackPosition, audioEngine]);

      const handleZoom = (event: React.WheelEvent<HTMLCanvasElement>) => {
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        setZoomLevel(Math.max(1, zoomLevel + delta));
      };

      const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const start = event.nativeEvent.offsetX;
        setSelectionStart(start);
        setSelectionEnd(start);
      };

      const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectionStart !== 0) {
          setSelectionEnd(event.nativeEvent.offsetX);
        }
      };

      const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const end = event.nativeEvent.offsetX;
        setSelectionEnd(end);
        setSelectionStart(0);
      };

      const handleMarkerAdd = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const position = event.nativeEvent.offsetX;
        setMarkers([...markers, position]);
      };

      const handleRegionAdd = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const start = event.nativeEvent.offsetX;
        setRegions([...regions, { start, end: start + 50 }]);
      };

      return (
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onWheel={handleZoom}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleMarkerAdd}
          onDoubleClick={handleRegionAdd}
        />
      );
    };

    export default WaveformViewer;
