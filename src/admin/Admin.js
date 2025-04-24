import React, { useState } from 'react';

function Admin() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div>
      <h2>Admin</h2>
      <p>This is the Admin page.</p>
      <label>
        Enter some text: 
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </label>
      <p>Input value: {inputValue}</p>
    </div>
  );
}

export default Admin;
