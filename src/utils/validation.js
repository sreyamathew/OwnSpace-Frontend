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

  const priceStr = price.toString();

  // Check if price starts with zero (but allow single zero)
  if (priceStr.length > 1 && priceStr.startsWith('0')) {
    errors.push('Price cannot start with zero');
  }

  // Check if price has more than 15 digits
  const digitsOnly = priceStr.replace(/[^\d]/g, '');
  if (digitsOnly.length > 15) {
    errors.push('Price cannot exceed 15 digits');
  }

  const numericPrice = parseFloat(price);

  if (isNaN(numericPrice)) {
    errors.push('Price must be a valid number');
  } else if (numericPrice <= 0) {
    errors.push('Price must be greater than zero');
  }

  return errors;
};

// Property-specific validation functions
export const validatePropertyTitle = (title) => {
  const errors = [];
  
  if (!title || !title.trim()) {
    errors.push('Property title is required');
    return errors;
  }
  
  const trimmedTitle = title.trim();

  // Check if title contains only letters and spaces
  const lettersOnlyRegex = /^[A-Za-z\s]+$/;
  if (!lettersOnlyRegex.test(trimmedTitle)) {
    errors.push('Property title should contain only letters and spaces');
  }

  if (trimmedTitle.length < 5) {
    errors.push('Property title must be at least 5 characters long');
  }

  if (trimmedTitle.length > 100) {
    errors.push('Property title cannot exceed 100 characters');
  }
  
  return errors;
};

export const validatePropertyDescription = (description) => {
  const errors = [];
  
  if (!description || !description.trim()) {
    errors.push('Property description is required');
    return errors;
  }
  
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length < 20) {
    errors.push('Property description must be at least 20 characters long');
  }
  
  if (trimmedDescription.length > 1000) {
    errors.push('Property description cannot exceed 1000 characters');
  }
  
  return errors;
};

export const validatePropertyType = (propertyType) => {
  const errors = [];
  
  if (!propertyType) {
    errors.push('Property type is required');
    return errors;
  }
  
  const validTypes = ['house', 'apartment', 'condo', 'townhouse', 'villa', 'bungalow', 'commercial', 'land', 'other'];
  
  if (!validTypes.includes(propertyType.toLowerCase())) {
    errors.push('Please select a valid property type');
  }
  
  return errors;
};

export const validateBedrooms = (bedrooms) => {
  const errors = [];
  
  if (bedrooms === '' || bedrooms === null || bedrooms === undefined) {
    return errors; // Optional field
  }
  
  const numericBedrooms = parseInt(bedrooms);
  
  if (isNaN(numericBedrooms)) {
    errors.push('Bedrooms must be a valid number');
  } else if (numericBedrooms < 0) {
    errors.push('Bedrooms cannot be negative');
  } else if (numericBedrooms > 15) {
    errors.push('Bedrooms cannot exceed 15');
  }
  
  return errors;
};

export const validateBathrooms = (bathrooms) => {
  const errors = [];
  
  if (bathrooms === '' || bathrooms === null || bathrooms === undefined) {
    return errors; // Optional field
  }
  
  const numericBathrooms = parseFloat(bathrooms);
  
  if (isNaN(numericBathrooms)) {
    errors.push('Bathrooms must be a valid number');
  } else if (numericBathrooms < 0) {
    errors.push('Bathrooms cannot be negative');
  } else if (numericBathrooms > 15) {
    errors.push('Bathrooms cannot exceed 15');
  }
  
  return errors;
};

export const validateArea = (area) => {
  const errors = [];

  if (area === '' || area === null || area === undefined) {
    return errors; // Optional field
  }

  const areaStr = area.toString();

  // Check if area starts with zero (but allow single zero)
  if (areaStr.length > 1 && areaStr.startsWith('0')) {
    errors.push('Area cannot start with zero');
  }

  // Check if area has more than 15 digits
  const digitsOnly = areaStr.replace(/[^\d]/g, '');
  if (digitsOnly.length > 15) {
    errors.push('Area cannot exceed 15 digits');
  }

  const numericArea = parseFloat(area);

  if (isNaN(numericArea)) {
    errors.push('Area must be a valid number');
  } else if (numericArea <= 0) {
    errors.push('Area cannot be zero');
  }

  return errors;
};

export const validateAddress = (address) => {
  const errors = [];
  
  if (!address || !address.trim()) {
    errors.push('Street address is required');
    return errors;
  }
  
  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length < 5) {
    errors.push('Street address must be at least 5 characters long');
  }
  
  if (trimmedAddress.length > 200) {
    errors.push('Street address cannot exceed 200 characters');
  }
  
  return errors;
};

export const validateCity = (city) => {
  const errors = [];
  
  if (!city || !city.trim()) {
    errors.push('City is required');
    return errors;
  }
  
  const trimmedCity = city.trim();
  
  if (trimmedCity.length < 2) {
    errors.push('City must be at least 2 characters long');
  }
  
  if (trimmedCity.length > 50) {
    errors.push('City cannot exceed 50 characters');
  }
  
  // City should only contain letters, spaces, and common punctuation
  if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedCity)) {
    errors.push('City can only contain letters, spaces, hyphens, apostrophes, and periods');
  }
  
  return errors;
};

export const validateState = (state) => {
  const errors = [];
  
  if (!state || !state.trim()) {
    errors.push('State is required');
    return errors;
  }
  
  const trimmedState = state.trim();
  
  if (trimmedState.length < 2) {
    errors.push('State must be at least 2 characters long');
  }
  
  if (trimmedState.length > 50) {
    errors.push('State cannot exceed 50 characters');
  }
  
  // State should only contain letters, spaces, and common punctuation
  if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedState)) {
    errors.push('State can only contain letters, spaces, hyphens, apostrophes, and periods');
  }
  
  return errors;
};

export const validateZipCode = (zipCode) => {
  const errors = [];
  
  if (zipCode === '' || zipCode === null || zipCode === undefined) {
    return errors; // Optional field
  }
  
  const trimmedZipCode = zipCode.trim();

  // Zip code must be exactly 6 digits
  if (!/^\d{6}$/.test(trimmedZipCode)) {
    errors.push('Zip code must be exactly 6 digits');
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
      
    // Property-specific validations
    case 'title':
      const titleErrors = validatePropertyTitle(value);
      return titleErrors.length > 0 ? titleErrors[0] : '';
      
    case 'description':
      const descriptionErrors = validatePropertyDescription(value);
      return descriptionErrors.length > 0 ? descriptionErrors[0] : '';
      
    case 'propertyType':
      const propertyTypeErrors = validatePropertyType(value);
      return propertyTypeErrors.length > 0 ? propertyTypeErrors[0] : '';
      
    case 'bedrooms':
      const bedroomsErrors = validateBedrooms(value);
      return bedroomsErrors.length > 0 ? bedroomsErrors[0] : '';
      
    case 'bathrooms':
      const bathroomsErrors = validateBathrooms(value);
      return bathroomsErrors.length > 0 ? bathroomsErrors[0] : '';
      
    case 'area':
      const areaErrors = validateArea(value);
      return areaErrors.length > 0 ? areaErrors[0] : '';
      
    case 'address':
      const addressErrors = validateAddress(value);
      return addressErrors.length > 0 ? addressErrors[0] : '';
      
    case 'city':
      const cityErrors = validateCity(value);
      return cityErrors.length > 0 ? cityErrors[0] : '';
      
    case 'state':
      const stateErrors = validateState(value);
      return stateErrors.length > 0 ? stateErrors[0] : '';
      
    case 'zipCode':
      const zipCodeErrors = validateZipCode(value);
      return zipCodeErrors.length > 0 ? zipCodeErrors[0] : '';
      
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
        
      // Property-specific validations
      case 'title':
        fieldErrors = validatePropertyTitle(formData[field]);
        break;
        
      case 'description':
        fieldErrors = validatePropertyDescription(formData[field]);
        break;
        
      case 'propertyType':
        fieldErrors = validatePropertyType(formData[field]);
        break;
        
      case 'bedrooms':
        fieldErrors = validateBedrooms(formData[field]);
        break;
        
      case 'bathrooms':
        fieldErrors = validateBathrooms(formData[field]);
        break;
        
      case 'area':
        fieldErrors = validateArea(formData[field]);
        break;
        
      case 'address':
        fieldErrors = validateAddress(formData[field]);
        break;
        
      case 'city':
        fieldErrors = validateCity(formData[field]);
        break;
        
      case 'state':
        fieldErrors = validateState(formData[field]);
        break;
        
      case 'zipCode':
        fieldErrors = validateZipCode(formData[field]);
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