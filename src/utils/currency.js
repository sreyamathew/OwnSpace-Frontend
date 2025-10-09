// Simple INR currency formatter for consistent display across the app
export function formatINR(amount, options = {}) {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(Number(amount) || 0);
  } catch (_) {
    return `₹${amount}`;
  }
}

export function formatINRWithPaise(amount) {
  return formatINR(amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

