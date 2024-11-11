import React, { useEffect, useState } from 'react';
    import AudioEngine from './audioEngine';

    const MiniPlayer: React.FC = () => {
      const [audioEngine] = useState(new AudioEngine());
      const [isPlaying, setIsPlaying] = useState(false);
      const [position, setPosition] = useState(0);

      useEffect(() => {
        const loadAudio = async () => {
          await audioEngine.loadAudio('path/to/audio/file.mp3');
        };

        loadAudio();

        return () => {
          audioEngine.stop();
        };
      }, [audioEngine]);

      const handlePlayPause = () => {
        if (isPlaying) {
          audioEngine.stop();
        } else {
          audioEngine.play('path/to/audio/file.mp3');
        }
        setIsPlaying(!isPlaying);
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
        <div className="fixed bottom-0 right-0 m-4 p-2 bg-gray-800 text-white rounded shadow-lg z-50">
          <div className="flex justify-between items-center">
            <button className="px-2 py-1 bg-primary rounded" onClick={handlePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span className="text-gray-300">{position.toFixed(2)}s</span>
          </div>
        </div>
      );
    };

    const App: React.FC = () => {
      return (
        <div className="flex flex-col h-screen">
          <MiniPlayer />
        </div>
      );
    };

    export default App;
