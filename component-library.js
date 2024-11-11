// Example React component library

    import React from 'react';

    export const Button = ({ children, onClick }) => (
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600 active:bg-purple-700"
        onClick={onClick}
      >
        {children}
      </button>
    );

    export const Panel = ({ title, children }) => (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-purple-400">{title}</h2>
        {children}
      </div>
    );
