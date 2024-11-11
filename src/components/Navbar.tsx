import React from 'react';

    interface NavbarProps {
      activeTab: string;
      setActiveTab: (tab: string) => void;
    }

    const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
      return (
        <nav className="flex justify-between items-center p-4 bg-primary text-white">
          <div className="flex space-x-4">
            <button
              className={`${activeTab === 'browser' ? 'bg-accent' : 'bg-secondary'} px-4 py-2 rounded`}
              onClick={() => setActiveTab('browser')}
            >
              Browser
            </button>
            <button
              className={`${activeTab === 'waveform' ? 'bg-accent' : 'bg-secondary'} px-4 py-2 rounded`}
              onClick={() => setActiveTab('waveform')}
            >
              Waveform
            </button>
            <button
              className={`${activeTab === 'details' ? 'bg-accent' : 'bg-secondary'} px-4 py-2 rounded`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>
        </nav>
      );
    };

    export default Navbar;
