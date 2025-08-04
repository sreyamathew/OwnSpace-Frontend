import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const ValidationSummary = () => {
  const validationRules = [
    {
      category: "Name Validation",
      rules: [
        "Must start with a letter",
        "Cannot contain numbers",
        "Only letters and spaces allowed",
        "Minimum 2 characters required"
      ]
    },
    {
      category: "Email Validation", 
      rules: [
        "Must start with a letter",
        "Must end with @gmail.com or @edu.in",
        "Valid email format required"
      ]
    },
    {
      category: "Phone Validation",
      rules: [
        "Exactly 10 digits required",
        "No letters allowed",
        "Must start with digits 2-9 (not 0 or 1)"
      ]
    },
    {
      category: "Password Validation",
      rules: [
        "Minimum 8 characters",
        "At least one uppercase letter",
        "At least one lowercase letter", 
        "At least one number",
        "At least one special character",
        "No common patterns allowed"
      ]
    },
    {
      category: "Price Validation",
      rules: [
        "Must be greater than zero",
        "Valid number format required",
        "Cannot exceed $999,999,999"
      ]
    }
  ];

  const implementedForms = [
    "Login Form",
    "Registration Form", 
    "Agent Registration Form",
    "Add Property Form"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Validation Implementation Summary</h2>
        <p className="text-gray-600">Comprehensive validation has been implemented across all forms</p>
      </div>

      {/* Implemented Forms */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          Forms with Validation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {implementedForms.map((form, index) => (
            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800">{form}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Rules */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          Validation Rules
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validationRules.map((category, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
              <ul className="space-y-2">
                {category.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="flex items-start">
                    <AlertCircle className="h-3 w-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Validation Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Real-time Validation</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• On-focus error messages</li>
              <li>• Real-time password strength indicator</li>
              <li>• Instant field validation feedback</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">User Experience</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Clear error messages</li>
              <li>• Visual feedback with colors</li>
              <li>• Helpful placeholder text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationSummary;