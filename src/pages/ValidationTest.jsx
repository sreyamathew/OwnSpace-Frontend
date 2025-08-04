import React, { useState } from 'react';
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validatePassword, 
  validatePrice,
  getPasswordStrength 
} from '../utils/validation';

const ValidationTest = () => {
  const [testValues, setTestValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    price: ''
  });

  const [results, setResults] = useState({});
  const [blurErrors, setBlurErrors] = useState({});

  const handleTest = (field, value) => {
    let validationResult = [];
    let passwordStrength = null;

    switch (field) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phone':
        validationResult = validatePhone(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        passwordStrength = getPasswordStrength(value);
        break;
      case 'price':
        validationResult = validatePrice(value);
        break;
    }

    setResults(prev => ({
      ...prev,
      [field]: {
        errors: validationResult,
        isValid: validationResult.length === 0,
        passwordStrength
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setTestValues(prev => ({
      ...prev,
      [field]: value
    }));
    handleTest(field, value);
    
    // Clear blur error only if input becomes valid
    if (blurErrors[field]) {
      let validationResult = [];
      switch (field) {
        case 'name':
          validationResult = validateName(value);
          break;
        case 'email':
          validationResult = validateEmail(value);
          break;
        case 'phone':
          validationResult = validatePhone(value);
          break;
        case 'password':
          validationResult = validatePassword(value);
          break;
        case 'price':
          validationResult = validatePrice(value);
          break;
      }
      
      if (validationResult.length === 0) {
        setBlurErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
  };

  const handleInputFocus = (field) => {
    // Clear blur error when focusing
    setBlurErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleInputBlur = (field, value) => {
    // Show error when leaving field if invalid
    let validationResult = [];
    switch (field) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phone':
        validationResult = validatePhone(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'price':
        validationResult = validatePrice(value);
        break;
    }
    
    if (validationResult.length > 0) {
      setBlurErrors(prev => ({
        ...prev,
        [field]: validationResult[0]
      }));
    }
  };

  const testCases = [
    {
      field: 'name',
      label: 'Name Validation',
      placeholder: 'Try: "John123", "123John", "Jo", "John Doe"',
      validExamples: ['John Doe', 'Alice Smith'],
      invalidExamples: ['John123', '123John', 'Jo', 'John@Doe']
    },
    {
      field: 'email', 
      label: 'Email Validation',
      placeholder: 'Try: "john@yahoo.com", "123@gmail.com", "john@gmail.com"',
      validExamples: ['john@gmail.com', 'alice@edu.in'],
      invalidExamples: ['john@yahoo.com', '123@gmail.com', 'john.gmail.com']
    },
    {
      field: 'phone',
      label: 'Phone Validation', 
      placeholder: 'Try: "123456789", "12345678901", "9876543210"',
      validExamples: ['9876543210', '8765432109'],
      invalidExamples: ['123456789', '12345678901', '0876543210', '1876543210']
    },
    {
      field: 'password',
      label: 'Password Validation',
      placeholder: 'Try: "password", "Password1!", "Pass123!"',
      validExamples: ['MySecure123!', 'StrongPass456@'],
      invalidExamples: ['password', 'PASSWORD', '123456', 'Pass123']
    },
    {
      field: 'price',
      label: 'Price Validation',
      placeholder: 'Try: "-100", "0", "450000", "abc"',
      validExamples: ['450000', '1', '999999999'],
      invalidExamples: ['-100', '0', 'abc', '1000000000']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Validation Test Page</h1>
          <p className="text-gray-600">Test the validation rules implemented across all forms</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>New Behavior:</strong> Error messages appear when you move the cursor away from a field (onBlur) 
              and remain visible until you correct the input.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testCases.map((testCase) => (
            <div key={testCase.field} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{testCase.label}</h3>
              
              <div className="mb-4">
                <input
                  type={testCase.field === 'password' ? 'password' : testCase.field === 'price' ? 'number' : 'text'}
                  value={testValues[testCase.field]}
                  onChange={(e) => handleInputChange(testCase.field, e.target.value)}
                  onFocus={() => handleInputFocus(testCase.field)}
                  onBlur={(e) => handleInputBlur(testCase.field, e.target.value)}
                  placeholder={testCase.placeholder}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    blurErrors[testCase.field] || results[testCase.field]?.isValid === false 
                      ? 'border-red-300 focus:ring-red-500' 
                      : results[testCase.field]?.isValid === true
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>

              {/* Password Strength Indicator */}
              {testCase.field === 'password' && testValues.password && results.password?.passwordStrength && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          results.password.passwordStrength.color === 'red' ? 'bg-red-500' :
                          results.password.passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                          results.password.passwordStrength.color === 'green' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${(results.password.passwordStrength.strength / 6) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      results.password.passwordStrength.color === 'red' ? 'text-red-600' :
                      results.password.passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                      results.password.passwordStrength.color === 'green' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {results.password.passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Validation Results */}
              <div className="mb-4">
                {blurErrors[testCase.field] ? (
                  <p className="text-sm text-red-600">• {blurErrors[testCase.field]}</p>
                ) : results[testCase.field]?.errors?.length > 0 ? (
                  <div className="space-y-1">
                    {results[testCase.field].errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">• {error}</p>
                    ))}
                  </div>
                ) : testValues[testCase.field] && results[testCase.field]?.isValid ? (
                  <p className="text-sm text-green-600">✓ Valid input</p>
                ) : null}
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-1">Valid Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {testCase.validExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleInputChange(testCase.field, example)}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-1">Invalid Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {testCase.invalidExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleInputChange(testCase.field, example)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Implementation Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">✅ Completed Features</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Name validation (letters only, starts with letter)</li>
                <li>• Email validation (@gmail.com, @edu.in only)</li>
                <li>• Phone validation (10 digits, no letters)</li>
                <li>• Password validation (8+ chars, mixed case, numbers, symbols)</li>
                <li>• Price validation (greater than 0)</li>
                <li>• On-blur validation (shows errors when leaving field)</li>
                <li>• Password strength indicator</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">📋 Forms Updated</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Login Form</li>
                <li>• Registration Form</li>
                <li>• Agent Registration Form (Admin Dashboard)</li>
                <li>• Add Property Form (Agent Dashboard)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationTest;