// Comprehensive form validation utility

export const validateName = (name) => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push('Name is required');
    return errors;
  }
  
  const trimmedName = name.trim();
  
  // Name should start with a letter
  if (!/^[a-zA-Z]/.test(trimmedName)) {
    errors.push('Name must start with a letter');
  }
  
  // Name should not contain numbers
  if (/\d/.test(trimmedName)) {
    errors.push('Name cannot contain numbers');
  }
  
  // Name should be at least 2 characters
  if (trimmedName.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  // Name should only contain letters and spaces
  if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return errors;
};

export const validateEmail = (email) => {
  const errors = [];
  
  if (!email || !email.trim()) {
    errors.push('Email is required');
    return errors;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Email should start with a letter
  if (!/^[a-zA-Z]/.test(trimmedEmail)) {
    errors.push('Email must start with a letter');
  }
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export const validatePhone = (phone) => {
  const errors = [];
  
  if (!phone || !phone.trim()) {
    errors.push('Phone number is required');
    return errors;
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Phone should be exactly 10 digits
  if (digitsOnly.length !== 10) {
    errors.push('Phone number must be exactly 10 digits');
  }
  
  // Phone should not contain letters
  if (/[a-zA-Z]/.test(phone)) {
    errors.push('Phone number cannot contain letters');
  }
  
  // Phone should start with 7, 8, or 9 only
  if (digitsOnly.length === 10 && !['7', '8', '9'].includes(digitsOnly[0])) {
    errors.push('Phone number must start with 7, 8, or 9');
  }
  
  return errors;
};

export const validateLicenseNumber = (licenseNumber) => {
  const errors = [];
  
  if (!licenseNumber || !licenseNumber.trim()) {
    errors.push('License number is required');
    return errors;
  }
  
  const trimmedLicense = licenseNumber.trim();
  
  // License must start with "RE" in capital letters
  if (!trimmedLicense.startsWith('RE')) {
    errors.push('License number must start with "RE" in capital letters');
  }
  
  // License must be exactly 11 characters (RE + 9 digits)
  if (trimmedLicense.length !== 11) {
    errors.push('License number must be exactly 11 characters (RE followed by 9 digits)');
  }
  
  // Check if it follows the pattern RE followed by exactly 9 digits
  if (!/^RE\d{9}$/.test(trimmedLicense)) {
    errors.push('License number must be RE followed by exactly 9 digits (e.g., RE123456789)');
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return errors;
  }
  
  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Maximum length
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Must contain at least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  // Should not contain common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns and is not secure');
      break;
    }
  }
  
  return errors;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
    return errors;
  }
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return errors;
};

export const validatePrice = (price) => {
  const errors = [];
  
  if (!price && price !== 0) {
    errors.push('Price is required');
    return errors;
  }
  
  const numericPrice = parseFloat(price);
  
  if (isNaN(numericPrice)) {
    errors.push('Price must be a valid number');
  } else if (numericPrice <= 0) {
    errors.push('Price must be greater than zero');
  } else if (numericPrice > 999999999) {
    errors.push('Price cannot exceed $999,999,999');
  }
  
  return errors;
};

// Real-time validation for on-focus events
export const getFieldValidationMessage = (fieldName, value, additionalData = {}) => {
  switch (fieldName) {
    case 'name':
      const nameErrors = validateName(value);
      return nameErrors.length > 0 ? nameErrors[0] : '';
      
    case 'email':
      const emailErrors = validateEmail(value);
      return emailErrors.length > 0 ? emailErrors[0] : '';
      
    case 'phone':
      const phoneErrors = validatePhone(value);
      return phoneErrors.length > 0 ? phoneErrors[0] : '';
      
    case 'licenseNumber':
      const licenseErrors = validateLicenseNumber(value);
      return licenseErrors.length > 0 ? licenseErrors[0] : '';
      
    case 'password':
      const passwordErrors = validatePassword(value);
      return passwordErrors.length > 0 ? passwordErrors[0] : '';
      
    case 'confirmPassword':
      const confirmErrors = validateConfirmPassword(additionalData.password, value);
      return confirmErrors.length > 0 ? confirmErrors[0] : '';
      
    case 'price':
      const priceErrors = validatePrice(value);
      return priceErrors.length > 0 ? priceErrors[0] : '';
      
    default:
      return '';
  }
};

// Comprehensive form validation
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};
  
  // Validate each field based on its type
  Object.keys(formData).forEach(field => {
    let fieldErrors = [];
    
    switch (field) {
      case 'name':
      case 'fullName':
        fieldErrors = validateName(formData[field]);
        break;
        
      case 'email':
        fieldErrors = validateEmail(formData[field]);
        break;
        
      case 'phone':
        if (formData[field]) { // Only validate if phone is provided
          fieldErrors = validatePhone(formData[field]);
        } else if (requiredFields.includes('phone')) {
          fieldErrors = ['Phone number is required'];
        }
        break;
        
      case 'password':
        fieldErrors = validatePassword(formData[field]);
        break;
        
      case 'confirmPassword':
        fieldErrors = validateConfirmPassword(formData.password, formData[field]);
        break;
        
      case 'price':
        fieldErrors = validatePrice(formData[field]);
        break;
        
      default:
        // Handle required fields that don't have specific validation
        if (requiredFields.includes(field) && (!formData[field] || !formData[field].toString().trim())) {
          fieldErrors = [`${field.charAt(0).toUpperCase() + field.slice(1)} is required`];
        }
        break;
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors[0]; // Show only the first error for each field
    }
  });
  
  return errors;
};

// Password strength indicator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No password', color: 'gray' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    longLength: password.length >= 12
  };
  
  Object.values(checks).forEach(check => {
    if (check) score++;
  });
  
  if (score <= 2) {
    return { strength: score, label: 'Weak', color: 'red' };
  } else if (score <= 4) {
    return { strength: score, label: 'Medium', color: 'yellow' };
  } else {
    return { strength: score, label: 'Strong', color: 'green' };
  }
};