'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { submitPaymentReference } from '@/app/actions/addBooking';
import { FaSpinner, FaCheckCircle, FaCopy } from 'react-icons/fa';

// ─── Put your actual QR code images in /public/payment/ ──────────────────────
// /public/payment/gcash-qr.png   ← your GCash QR
// /public/payment/maya-qr.png    ← your Maya QR
// And update the account details below to your own
const PAYMENT_ACCOUNTS = {
  gcash: {
    label:   'GCash',
    color:   'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    bgLight: 'bg-blue-50',
    qr:      '/images/payment/gcash-qr.png',
    number:  '0917 123 4567',       
    name:    'J*** **** **uz',      
  },
  maya: {
    label:   'Maya',
    color:   'bg-green-500',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    bgLight: 'bg-green-50',
    qr:      'images/payment/maya-qr.png',
    number:  '0961 123 4567',        
    name:    'J*** **** **uz',       
  },
};

export default function PaymentPageClient({ booking }) {
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [reference,      setReference]      = useState('');
  const [copied,         setCopied]         = useState('');
  const [error,          setError]          = useState('');
  const [isPending,      startTransition]   = useTransition();

  const account  = PAYMENT_ACCOUNTS[selectedMethod];

  const formatCurrency = (n) =>
    `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  const checkIn  = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!reference.trim()) {
      setError('Please enter your reference number.');
      return;
    }
    if (reference.trim().length < 6) {
      setError('Reference number seems too short. Please check and try again.');
      return;
    }
    setError('');

    const formData = new FormData();
    formData.set('bookingId',        booking._id);
    formData.set('paymentReference', reference.trim());
    formData.set('paymentMethod',    selectedMethod);

    startTransition(async () => {
      try {
        await submitPaymentReference(formData);
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    });
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4'>
      <div className='max-w-lg mx-auto space-y-6'>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Complete Your Payment</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Send the exact amount and enter your reference number below
          </p>
        </div>

        {/* ── Amount due card ─────────────────────────────────────────────── */}
        <div className='bg-[#1A1E43] text-white rounded-2xl p-5 flex justify-between items-center'>
          <div>
            <p className='text-sm text-blue-200'>Amount Due</p>
            <p className='text-3xl font-bold mt-0.5'>{formatCurrency(booking.total_price)}</p>
            <p className='text-xs text-blue-200 mt-1'>
              {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''} ·{' '}
              {formatDate(checkIn)} → {formatDate(checkOut)}
            </p>
          </div>
          <div className='text-right text-xs text-blue-200 space-y-0.5'>
            <p>Booking ref</p>
            <p className='font-mono text-white text-[11px]'>{booking._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* ── Method selector ─────────────────────────────────────────────── */}
        <div className='grid grid-cols-2 gap-3'>
          {Object.entries(PAYMENT_ACCOUNTS).map(([key, acc]) => (
            <button
              key={key}
              onClick={() => setSelectedMethod(key)}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                selectedMethod === key
                  ? `${acc.borderColor} ${acc.bgLight} ${acc.textColor}`
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${acc.color}`} />
              {acc.label}
            </button>
          ))}
        </div>

        {/* ── QR + account details ─────────────────────────────────────────── */}
        <div className={`rounded-2xl border-2 ${account.borderColor} ${account.bgLight} p-6`}>
          <div className='flex flex-col items-center gap-4'>

            {/* QR Code */}
            <div className='bg-white rounded-xl p-3 shadow-sm'>
              <Image
                src={account.qr}
                alt={`${account.label} QR Code`}
                width={180}
                height={180}
                className='rounded-lg'
              />
            </div>

            <p className='text-sm text-gray-500'>
              Scan with your <span className='font-semibold'>{account.label}</span> app
            </p>

            {/* Or send to number */}
            <div className='w-full border-t border-gray-200 pt-4 space-y-3'>
              <p className='text-xs text-center text-gray-400 font-medium uppercase tracking-wide'>
                Or send to
              </p>

              {/* Account number */}
              <div className='flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200'>
                <div>
                  <p className='text-xs text-gray-400'>Mobile Number</p>
                  <p className='font-bold text-gray-900'>{account.number}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(account.number.replace(/\s/g, ''), 'number')}
                  className='text-gray-400 hover:text-gray-700 transition-colors p-1'
                >
                  {copied === 'number'
                    ? <FaCheckCircle className='text-green-500' />
                    : <FaCopy />
                  }
                </button>
              </div>

              {/* Account name */}
              <div className='flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200'>
                <div>
                  <p className='text-xs text-gray-400'>Account Name</p>
                  <p className='font-bold text-gray-900'>{account.name}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(account.name, 'name')}
                  className='text-gray-400 hover:text-gray-700 transition-colors p-1'
                >
                  {copied === 'name'
                    ? <FaCheckCircle className='text-green-500' />
                    : <FaCopy />
                  }
                </button>
              </div>

              {/* Amount to send */}
              <div className='flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200'>
                <div>
                  <p className='text-xs text-gray-400'>Exact Amount</p>
                  <p className='font-bold text-gray-900'>{formatCurrency(booking.total_price)}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(booking.total_price.toFixed(2), 'amount')}
                  className='text-gray-400 hover:text-gray-700 transition-colors p-1'
                >
                  {copied === 'amount'
                    ? <FaCheckCircle className='text-green-500' />
                    : <FaCopy />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reference number form ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className='bg-white rounded-2xl border border-gray-200 p-6 space-y-4'>
          <div>
            <h2 className='font-semibold text-gray-900'>Enter Reference Number</h2>
            <p className='text-sm text-gray-500 mt-0.5'>
              After paying, enter the reference number from your {account.label} transaction receipt.
            </p>
          </div>

          <div className='border border-gray-200 rounded-xl p-3'>
            <label className='block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1'>
              {account.label} Reference Number
            </label>
            <input
              type='text'
              value={reference}
              onChange={(e) => { setReference(e.target.value); setError(''); }}
              placeholder='e.g. 1234567890'
              className='w-full text-sm text-gray-800 placeholder-gray-300 focus:outline-none bg-transparent'
            />
          </div>

          {error && (
            <div className='flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type='submit'
            disabled={isPending || !reference.trim()}
            className='w-full flex items-center justify-center gap-2 bg-[#1A1E43] hover:bg-[#303879] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors'
          >
            {isPending ? (
              <>
                <FaSpinner className='animate-spin' />
                Submitting…
              </>
            ) : (
              'Submit Reference Number'
            )}
          </button>

          <p className='text-xs text-center text-gray-400'>
            The host will verify your payment and confirm your booking.
          </p>
        </form>

      </div>
    </div>
  );
}