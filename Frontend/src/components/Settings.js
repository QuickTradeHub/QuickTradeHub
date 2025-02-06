import React from 'react';

const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        {/* Example settings */}
        <div>
          <label className="block">Company Name</label>
          <input type="text" className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Logo</label>
          <input type="file" className="border p-2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
