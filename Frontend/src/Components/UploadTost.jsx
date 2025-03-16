import React, { useState, useEffect } from 'react';

const UploadToast = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('uploading'); // 'uploading', 'success', 'error'
  
  // Colors as specified
  const yellowColor = '#ff9700';
  const greenColor = '#0e606e';
  
  const handleUpload = () => {
    setVisible(true);
    setStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setStatus('success');
      // Auto hide after success
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    }, 2000);
  };
  
  // For demo purposes, hide toast after a while
  useEffect(() => {
    if (visible && status === 'success') {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, status]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Upload button */}
      <button 
        onClick={handleUpload}
        className="px-6 py-2 text-white rounded-md shadow-md"
        style={{ backgroundColor: greenColor }}
      >
        Upload
      </button>
      
      {/* Toast notification */}
      {visible && (
        <div 
          className="fixed top-6 right-6 flex items-center p-4 rounded-md shadow-lg text-white max-w-sm animate-fade-in transition-all duration-300"
          style={{ 
            backgroundColor: status === 'uploading' ? yellowColor : greenColor,
            opacity: visible ? 1 : 0,
            transform: `translateY(${visible ? '0' : '-20px'})`
          }}
        >
          {/* Icons based on status */}
          {status === 'uploading' && (
            <div className="mr-3 animate-spin">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                <path d="M12 2C12.5523 2 13 2.44772 13 3V5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5V3C11 2.44772 11.4477 2 12 2ZM12 18C12.5523 18 13 18.4477 13 19V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V19C11 18.4477 11.4477 18 12 18ZM3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H5C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11H3ZM19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H19ZM5.63604 5.63604C5.24352 6.02856 5.24352 6.66173 5.63604 7.05425L7.05025 8.46847C7.44278 8.86099 8.07594 8.86099 8.46847 8.46847C8.86099 8.07594 8.86099 7.44278 8.46847 7.05025L7.05425 5.63604C6.66173 5.24352 6.02856 5.24352 5.63604 5.63604ZM15.5355 15.5355C15.1429 15.9281 15.1429 16.5613 15.5355 16.9539L16.9497 18.3681C17.3422 18.7606 17.9754 18.7606 18.368 18.3681C18.7605 17.9755 18.7605 17.3424 18.368 16.9498L16.9538 15.5355C16.5612 15.143 15.928 15.143 15.5355 15.5355ZM18.3681 5.63604C17.9756 5.24352 17.3424 5.24352 16.9499 5.63604L15.5357 7.05025C15.1432 7.44278 15.1432 8.07594 15.5357 8.46847C15.9282 8.86099 16.5614 8.86099 16.9539 8.46847L18.3681 7.05425C18.7606 6.66173 18.7606 6.02856 18.3681 5.63604ZM8.46847 15.5355C8.07594 15.143 7.44278 15.143 7.05025 15.5355L5.63604 16.9497C5.24352 17.3422 5.24352 17.9754 5.63604 18.3679C6.02856 18.7605 6.66173 18.7605 7.05425 18.3679L8.46847 16.9538C8.86099 16.5612 8.86099 15.928 8.46847 15.5355Z" />
              </svg>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92894L11.0026 16Z" />
              </svg>
            </div>
          )}
          
          <div>
            <p className="font-medium">
              {status === 'uploading' && 'Uploading document...'} 
              {status === 'success' && 'Document uploaded successfully!'}
            </p>
            <p className="text-sm opacity-90">
              {status === 'uploading' && 'Please wait while we process your file.'}
              {status === 'success' && 'Your document is now available in your records.'}
            </p>
          </div>
          
          {/* Close button */}
          <button 
            onClick={() => setVisible(false)}
            className="ml-auto p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="fill-current">
              <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Demo explanation */}
      <p className="mt-4 text-gray-600">Click the Upload button to see the toast notification</p>
    </div>
  );
};

export default UploadToast;