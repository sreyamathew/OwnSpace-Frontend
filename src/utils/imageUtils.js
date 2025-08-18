// Image utility functions for handling local image storage

// Function to save image to local assets and return the path
export const saveImageToAssets = async (file, propertyId) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const fileName = `property_${propertyId || 'temp'}_${timestamp}_${randomId}.${fileExtension}`;
      
      // For demo purposes, we'll use a data URL (base64) approach
      // In a real application, you might want to upload to a server or cloud storage
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result, // This will be a data URL
          fileName: fileName,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
        
        resolve(imageData);
      };
      
      reader.onerror = (error) => {
        reject(new Error('Failed to read image file'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to validate image file
export const validateImageFile = (file) => {
  const errors = [];
  
  // Check if file exists
  if (!file) {
    errors.push('No file selected');
    return errors;
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    errors.push('Only JPEG, PNG, GIF, and WebP images are allowed');
  }
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    errors.push('Image size must be less than 10MB');
  }
  
  // Check minimum dimensions (optional)
  return new Promise((resolve) => {
    if (errors.length > 0) {
      resolve(errors);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      // Check minimum dimensions
      if (img.width < 300 || img.height < 200) {
        errors.push('Image must be at least 300x200 pixels');
      }
      
      // Check aspect ratio (optional - warn if too extreme)
      const aspectRatio = img.width / img.height;
      if (aspectRatio < 0.5 || aspectRatio > 3) {
        errors.push('Image aspect ratio should be between 1:2 and 3:1 for best display');
      }
      
      resolve(errors);
    };
    
    img.onerror = () => {
      errors.push('Invalid image file');
      resolve(errors);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Function to process multiple images
export const processImages = async (files, propertyId) => {
  const processedImages = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Validate the image
      const validationErrors = await validateImageFile(file);
      
      if (validationErrors.length > 0) {
        errors.push({
          fileName: file.name,
          errors: validationErrors
        });
        continue;
      }
      
      // Save the image
      const imageData = await saveImageToAssets(file, propertyId);
      processedImages.push({
        ...imageData,
        isPrimary: i === 0 // First image is primary
      });
      
    } catch (error) {
      errors.push({
        fileName: file.name,
        errors: [error.message]
      });
    }
  }
  
  return {
    images: processedImages,
    errors: errors
  };
};

// Function to create thumbnail (optional)
export const createThumbnail = (file, maxWidth = 300, maxHeight = 200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Function to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to get image dimensions
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};