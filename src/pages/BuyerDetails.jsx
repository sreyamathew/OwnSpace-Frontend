import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const initialTouched = { name: false, address: false, email: false, phone: false };

const BuyerDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const [values, setValues] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  const [touched, setTouched] = useState(initialTouched);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setValues(v => ({
      ...v,
      name: v.name || user.name || '',
      email: v.email || user.email || '',
    }));
  }, [user]);

  // Validation regex per spec
  const nameRegex = useMemo(() => /^[A-Za-z][A-Za-z\s]*$/, []);
  const addressRegex = useMemo(() => /^[A-Za-z][A-Za-z0-9\s,.-]*$/, []);
  const emailRegex = useMemo(() => /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, []);
  const phoneRegex = useMemo(() => /^[6-9]\d{9}$/, []);

  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim()) e.name = 'Name is required.';
    else if (!nameRegex.test(values.name.trim())) e.name = 'Invalid name format.';
    if (!values.address.trim()) e.address = 'Address is required.';
    else if (!addressRegex.test(values.address.trim())) e.address = 'Invalid address format.';
    if (!values.email.trim()) e.email = 'Email is required.';
    else if (!emailRegex.test(values.email.trim())) e.email = 'Invalid email format.';
    if (!values.phone.trim()) e.phone = 'Phone number is required.';
    else if (!phoneRegex.test(values.phone.trim())) e.phone = 'Phone number must be 10 digits and start with 6-9.';
    return e;
  }, [values, nameRegex, addressRegex, emailRegex, phoneRegex]);

  const showError = (field) => (touched[field] || submitted) && errors[field];
  const showHint = (field) => touched[field] && !errors[field];

  const onFocus = (field) => () => setTouched(t => ({ ...t, [field]: true }));
  const onChange = (field) => (e) => setValues(v => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    try {
      const payload = { ...values, propertyId };
      sessionStorage.setItem('buyerDetails', JSON.stringify(payload));
    } catch (_) {}

    navigate(`/pay-advance/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Buyer Details</h1>
          <p className="text-sm text-gray-600 mb-6">Please provide your details to proceed with the advance payment.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={onChange('name')}
                  onFocus={onFocus('name')}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${showError('name') ? 'input-invalid' : showHint('name') ? 'input-valid' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                {touched.name && !errors.name && (
                  <p className="mt-1 text-xs text-gray-500">Enter your legal full name.</p>
                )}
                {showError('name') && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  id="address"
                  value={values.address}
                  onChange={onChange('address')}
                  onFocus={onFocus('address')}
                  rows={3}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${showError('address') ? 'input-invalid' : showHint('address') ? 'input-valid' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="House/Street, City, State, PIN"
                  autoComplete="street-address"
                />
                {touched.address && !errors.address && (
                  <p className="mt-1 text-xs text-gray-500">Include city/state and PIN for accuracy.</p>
                )}
                {showError('address') && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={onChange('email')}
                  onFocus={onFocus('email')}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${showError('email') ? 'input-invalid' : showHint('email') ? 'input-valid' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {touched.email && !errors.email && (
                  <p className="mt-1 text-xs text-gray-500">We’ll send payment confirmation here.</p>
                )}
                {showError('email') && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onChange={onChange('phone')}
                  onFocus={onFocus('phone')}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${showError('phone') ? 'input-invalid' : showHint('phone') ? 'input-valid' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />
                {touched.phone && !errors.phone && (
                  <p className="mt-1 text-xs text-gray-500">We may contact you for verification.</p>
                )}
                {showError('phone') && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue to Pay Advance
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuyerDetails;


