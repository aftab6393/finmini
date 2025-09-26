// frontend/src/components/Toast.jsx
import React, { useState, useEffect } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  return { toast, showToast };
};

// Add to buy transaction success
showToast('✅ Successfully purchased 10 units of Reliance Industries!', 'success');
