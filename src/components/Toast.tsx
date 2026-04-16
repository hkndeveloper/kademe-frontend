"use client";

import React from 'react';
import { Toaster, toast } from 'sonner';

export default function ToastContainer() {
  return (
    <Toaster 
      position="top-right"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: {
          borderRadius: '1rem',
          padding: '1rem',
        },
      }}
    />
  );
}

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  if (type === 'success') toast.success(message);
  else if (type === 'error') toast.error(message);
  else toast.info(message);
};
