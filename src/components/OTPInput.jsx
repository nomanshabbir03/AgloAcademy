// src/components/OTPInput.jsx
import { useEffect, useRef, useState } from 'react';

const OTPInput = ({ length = 6, onComplete, disabled = false, error = '' }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^[0-9]+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Submit if all fields are filled
    if (newOtp.every(num => num !== '') && newOtp.length === length) {
      onComplete(newOtp.join(''));
    }

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    const pasteArray = pasteData.split('').slice(0, length);
    
    if (pasteArray.every(char => /^[0-9]+$/.test(char))) {
      const newOtp = [...otp];
      pasteArray.forEach((char, i) => {
        if (i < length) {
          newOtp[i] = char;
        }
      });
      setOtp(newOtp);
      
      // Move focus to the end of the pasted data or last input
      const nextIndex = Math.min(pasteArray.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      
      // If we have a complete OTP, submit it
      if (pasteArray.length >= length) {
        onComplete(pasteArray.slice(0, length).join(''));
      }
    }
  };

  return (
    <div className="otp-container">
      <div className="flex justify-center space-x-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            disabled={disabled}
            className={`w-12 h-12 text-2xl text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm text-center mt-1">{error}</p>}
    </div>
  );
};

export default OTPInput;