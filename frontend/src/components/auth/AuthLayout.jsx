import React from 'react';

import '../../css/sign.css';

function AuthLayout({ children, title }) {
  return (
    <div className="bg-container">
      <div className="login-card">
        <h1 className="login-title">{title}</h1>
        {children}
      </div>

      <footer>
        &copy; 2026 ANIMATEWELL COMPANY. All Rights Reserved.
      </footer>
    </div>
  );
}

export default AuthLayout;