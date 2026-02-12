import React from 'react';

import '../../css/sign.css';

function GoogleButton({ onClick }) {
  return (
    <button type="button" className="btn btn-google" onClick={onClick}>
      <img 
        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
        width="18" 
        alt="Google Logo"
      />
      Continue with Google
    </button>
  );
}

export default GoogleButton;