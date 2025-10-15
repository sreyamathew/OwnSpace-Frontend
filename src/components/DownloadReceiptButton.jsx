import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0
});

const DownloadReceiptButton = ({
  offer,
  variant = 'button'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!offer?.advancePaid) {
      setError('Advance has not been paid for this property.');
      return;
    }
    setError('');

    try {
      setIsGenerating(true);

      const doc = new jsPDF();
      const leftMargin = 14;
      const lineHeight = 8;
      let cursorY = 22;

      const buyer = offer.buyerDetails || {};
      const property = offer.propertyId || {};
      const payment = offer.paymentDetails || {};

      const buyerName = buyer.name || offer?.investorId?.name || 'Not provided';
      const buyerEmail = buyer.email || offer?.investorId?.email || 'Not provided';
      const buyerPhone = buyer.phone || offer?.investorId?.phone || 'Not provided';
      const buyerAddress = buyer.address || offer?.investorId?.address?.street || offer?.investorId?.address || 'Not provided';

      const propertyTitle = property.title || 'Unknown Property';
      const propertyAddress = property.address
        ? `${property.address.street || ''} ${property.address.city || ''} ${property.address.state || ''}`.trim()
        : property.location || property.addressText || 'Address not available';
      const propertyPrice = typeof property.price === 'number' ? formatCurrency.format(property.price) : 'N/A';
      const sellerInfo = property?.agentId?.name || property?.listedBy?.name || 'OwnSpace Admin';

      const amountPaid = formatCurrency.format(offer.advanceAmount || 1000);
      const paidDate = offer.advancePaidAt
        ? new Date(offer.advancePaidAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : 'Unknown';
      const paymentId = payment.paymentId || offer?.paymentRef?.paymentId || 'N/A';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('OwnSpace Real Estate Portal', leftMargin, cursorY);
      cursorY += lineHeight;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Advance Payment Receipt', leftMargin, cursorY);
      cursorY += lineHeight;

      doc.setFontSize(10);
      doc.text(`Receipt ID: ${paymentId}`, leftMargin, cursorY);
      cursorY += lineHeight;
      doc.text(`Generated on: ${new Date().toLocaleString()}`, leftMargin, cursorY);
      cursorY += lineHeight * 1.5;

      const drawSection = (title) => {
        doc.setFillColor(240, 243, 255);
        doc.rect(leftMargin - 2, cursorY - 6, 182, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title, leftMargin, cursorY);
        cursorY += lineHeight;
      };

      const drawKeyValue = (label, value) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`${label}:`, leftMargin, cursorY);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value || 'N/A'), leftMargin + 46, cursorY);
        cursorY += lineHeight;
      };

      drawSection('Buyer Details');
      drawKeyValue('Name', buyerName);
      drawKeyValue('Email', buyerEmail);
      drawKeyValue('Phone', buyerPhone);
      drawKeyValue('Address', buyerAddress);
      cursorY += lineHeight * 0.5;

      drawSection('Property Details');
      drawKeyValue('Property', propertyTitle);
      drawKeyValue('Location', propertyAddress);
      drawKeyValue('Price', propertyPrice);
      drawKeyValue('Seller', sellerInfo);
      cursorY += lineHeight * 0.5;

      drawSection('Payment Summary');
      drawKeyValue('Status', 'Advance Paid');
      drawKeyValue('Amount Paid', amountPaid);
      drawKeyValue('Paid On', paidDate);
      drawKeyValue('Payment Reference', paymentId);
      cursorY += lineHeight * 0.5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('Thank you for choosing OwnSpace. We appreciate your business!', leftMargin, cursorY + lineHeight);

      const fileName = `OwnSpace-Advance-Receipt-${paymentId}.pdf`;

      const pdfBlob = doc.output('blob');

      doc.save(fileName);

      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    } catch (err) {
      console.error('Failed to generate receipt', err);
      setError('Unable to generate receipt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const classNames = variant === 'link'
    ? 'text-blue-600 hover:text-blue-700 text-sm underline'
    : 'inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60';

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className={classNames}
      >
        {isGenerating ? 'Preparing Receipt...' : 'Download Receipt'}
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">{error}</span>
      )}
    </div>
  );
};

export default DownloadReceiptButton;