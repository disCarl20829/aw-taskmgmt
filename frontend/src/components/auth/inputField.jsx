import React, { useState } from 'react';

import '../../css/sign.css';

function InputField({
  icon,
  type = "text",
  placeholder,
  id,
  isPassword = false,
  value,
  onChange
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword
    ? (showPassword ? "text" : "password")
    : type;

  return (
    <div className="input-group mb-3">
      <span className="input-group-text">
        <i className={`bi bi-${icon}`}></i>
      </span>

      <input
        type={inputType}
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />

      {isPassword && (
        <span
          className="input-group-text toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer' }}
        >
          <i className={`bi bi-eye${showPassword ? '' : '-slash'}`}></i>
        </span>
      )}
    </div>
  );
}

export default InputField;