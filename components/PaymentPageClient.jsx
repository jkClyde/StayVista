'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { submitPaymentReference } from '@/app/actions/addBooking';
import {
  FaSpinner, FaCheckCircle, FaCopy,
  FaArrowLeft, FaShieldAlt, FaArrowRight,
  FaMoneyBillWave, FaFileAlt,
} from 'react-icons/fa';

const PAYMENT_ACCOUNTS = {
  gcash: {
    label:        'GCash',
    dot:          'bg-blue-400',
    textColor:    'text-blue-700',
    activeBg:     'linear-gradient(135deg, #eff6ff, #dbeafe)',
    activeBorder: '#93c5fd',
    qr:           '/images/payment/gcash-qr.png',
    number:       '0917 123 4567',
    name:         'J*** **** **uz',
  },
  maya: {
    label:        'Maya',
    dot:          'bg-emerald-400',
    textColor:    'text-emerald-700',
    activeBg:     'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    activeBorder: '#6ee7b7',
    qr:           '/images/payment/maya-qr.png',
    number:       '0961 123 4567',
    name:         'J*** **** **uz',
  },
};

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: 'Send Payment',     icon: <FaMoneyBillWave /> },
    { num: 2, label: 'Submit Reference', icon: <FaFileAlt /> },
  ];

  return (
    <div className='flex items-center justify-center gap-0 mb-8'>
      {steps.map((s, i) => (
        <div key={s.num} className='flex items-center'>
          {/* Step circle */}
          <div className='flex flex-col items-center gap-1.5'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step === s.num
                  ? 'text-white shadow-lg scale-110'
                  : step > s.num
                  ? 'text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-400'
              }`}
              style={
                step === s.num
                  ? { background: 'linear-gradient(135deg, #1A1E43, #303879)' }
                  : step > s.num
                  ? { background: '#10b981' }
                  : {}
              }
            >
              {step > s.num ? <FaCheckCircle className='text-base' /> : s.icon}
            </div>
            <span
              className={`text-xs font-semibold whitespace-nowrap ${
                step === s.num ? 'text-[#1A1E43]' : step > s.num ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>

          {/* Connector line between steps */}
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-3 mb-5 rounded-full transition-all duration-500 ${
                step > s.num ? 'bg-emerald-400' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text, id, copied, onCopy }) {
  return (
    <button
      type='button'
      onClick={() => onCopy(text, id)}
      className='flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100 active:scale-95'
    >
      {copied === id
        ? <FaCheckCircle className='text-emerald-500 text-sm' />
        : <FaCopy className='text-gray-400 text-sm' />
      }
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PaymentPageClient({ booking }) {
  const [step,           setStep]          = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [reference,      setReference]     = useState('');
  const [confirmed,      setConfirmed]     = useState(false);
  const [copied,         setCopied]        = useState('');
  const [error,          setError]         = useState('');
  const [isPending,      startTransition]  = useTransition();

  const account  = PAYMENT_ACCOUNTS[selectedMethod];
  const checkIn  = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatCurrency = (n) =>
    `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!reference.trim()) { setError('Please enter your reference number.'); return; }
    if (reference.trim().length < 6) { setError('Reference number seems too short.'); return; }
    if (!confirmed) { setError('Please confirm that you have already sent the payment.'); return; }
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
    <div className='min-h-screen' style={{ background: '#F4F6FB' }}>

      {/* ── Navy header ──────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1A1E43 0%, #2d3270 60%, #303879 100%)' }}>
        <div className='mx-auto px-4 sm:px-6 lg:px-10' style={{ maxWidth: '1620px' }}>
          {/* Back */}
          <div className='pt-5 pb-1'>
            <button
              type='button'
              onClick={() => step === 2 ? setStep(1) : window.history.back()}
              className='inline-flex items-center gap-2 text-blue-200 hover:text-white font-medium transition-colors group text-sm'
            >
              <FaArrowLeft className='group-hover:-translate-x-1 transition-transform text-xs' />
              {step === 2 ? 'Back to Payment Details' : 'Back'}
            </button>
          </div>

          {/* Title + amount */}
          <div className='pt-6 pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-white tracking-tight'>
                Complete Payment
              </h1>
              <p className='text-blue-200 mt-1.5 text-sm sm:text-base'>
                {step === 1
                  ? 'Send the exact amount using GCash or Maya'
                  : 'Enter the reference number from your receipt'}
              </p>
            </div>
            {/* Amount pill */}
            <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 self-start sm:self-auto'>
              <p className='text-blue-200 text-xs font-semibold uppercase tracking-widest mb-0.5'>Amount Due</p>
              <p className='text-2xl sm:text-3xl font-bold text-white'>
                {formatCurrency(booking.total_price)}
              </p>
              <p className='text-blue-200 text-xs mt-0.5'>
                {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''} ·{' '}
                {formatDate(checkIn)} → {formatDate(checkOut)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        className='mx-auto px-4 sm:px-6 lg:px-10 py-8'
        style={{ maxWidth: '1620px' }}
      >
        {/* Step indicator */}
        <StepIndicator step={step} />

        {/* ════════════════════════════════════════════════════════════════
            STEP 1 — Send Payment
        ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

            {/* Method selector + QR — spans 2 cols on lg */}
            <div className='lg:col-span-2 space-y-5'>

              {/* Method tabs */}
              <div className='grid grid-cols-2 gap-3'>
                {Object.entries(PAYMENT_ACCOUNTS).map(([key, acc]) => (
                  <button
                    key={key}
                    type='button'
                    onClick={() => setSelectedMethod(key)}
                    style={selectedMethod === key ? {
                      background: acc.activeBg,
                      borderColor: acc.activeBorder,
                    } : {}}
                    className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 font-semibold text-sm transition-all active:scale-95 ${
                      selectedMethod === key
                        ? acc.textColor
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${acc.dot}`} />
                    {acc.label}
                  </button>
                ))}
              </div>

              {/* QR + account details card */}
              <div className='bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden'>
                {/* QR section */}
                <div
                  className='p-6 flex flex-col items-center gap-4'
                  style={{ background: account.activeBg }}
                >
                  <div className='bg-white rounded-2xl p-4 shadow-md'>
                    <Image
                      src={account.qr}
                      alt={`${account.label} QR Code`}
                      width={200}
                      height={200}
                      className='rounded-xl block'
                    />
                  </div>
                  <p className='text-sm text-gray-600'>
                    Open <span className={`font-bold ${account.textColor}`}>{account.label}</span> and scan to pay
                  </p>
                </div>

                {/* Account rows */}
                <div className='p-5 space-y-2'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 text-center'>
                    Or send to this account
                  </p>
                  {[
                    { label: 'Mobile Number', value: account.number,                        id: 'number', copy: account.number.replace(/\s/g, '') },
                    { label: 'Account Name',  value: account.name,                          id: 'name',   copy: account.name },
                    { label: 'Exact Amount',  value: formatCurrency(booking.total_price),   id: 'amount', copy: booking.total_price.toFixed(2) },
                  ].map(({ label, value, id, copy }) => (
                    <div key={id} className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100'>
                      <div>
                        <p className='text-[10px] font-semibold uppercase tracking-wide text-gray-400'>{label}</p>
                        <p className='font-bold text-gray-900 text-sm mt-0.5'>{value}</p>
                      </div>
                      <CopyButton text={copy} id={id} copied={copied} onCopy={copyToClipboard} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking summary + CTA — 1 col */}
            <div className='space-y-5'>
              {/* Booking summary */}
              <div
                className='rounded-3xl p-5 text-white space-y-3'
                style={{ background: 'linear-gradient(135deg, #1A1E43, #303879)' }}
              >
                <p className='text-[10px] text-blue-200 font-bold uppercase tracking-widest'>Booking Summary</p>
                <p className='font-bold text-base leading-tight'>
                  {booking.property?.title || booking.property?.name || 'Property'}
                </p>
                <div className='space-y-1 text-sm text-blue-100'>
                  <p>📅 {formatDate(checkIn)} → {formatDate(checkOut)}</p>
                  <p>🌙 {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''}</p>
                  <p>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                </div>
                <div className='border-t border-white/20 pt-3 flex justify-between items-center'>
                  <span className='text-blue-200 text-sm'>Total</span>
                  <span className='text-xl font-bold'>{formatCurrency(booking.total_price)}</span>
                </div>
              </div>

              {/* Instruction callout */}
              <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 space-y-2'>
                <p className='font-bold flex items-center gap-2'>
                  ⚠️ Before you continue
                </p>
                <ul className='space-y-1.5 text-amber-700'>
                  <li className='flex items-start gap-2'>
                    <span className='mt-0.5 flex-shrink-0'>1.</span>
                    Send <strong>{formatCurrency(booking.total_price)}</strong> using {account.label}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-0.5 flex-shrink-0'>2.</span>
                    Take note of your <strong>reference number</strong> from the receipt
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-0.5 flex-shrink-0'>3.</span>
                    Then click the button below to submit it
                  </li>
                </ul>
              </div>

              {/* Next step button */}
              <button
                type='button'
                onClick={() => setStep(2)}
                className='w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95'
                style={{ background: 'linear-gradient(135deg, #1A1E43, #303879)' }}
              >
                I've Sent the Payment
                <FaArrowRight className='text-sm' />
              </button>

              <p className='text-xs text-center text-gray-400'>
                Don't click this until you've actually sent the payment
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 2 — Enter Reference Number
        ════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

            {/* Form — spans 2 cols */}
            <div className='lg:col-span-2 space-y-5'>
              <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5'>
                <div>
                  <h2 className='font-bold text-gray-900 text-xl'>Enter Your Reference Number</h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    Find it in your <span className={`font-semibold ${account.textColor}`}>{account.label}</span> app under
                    transaction history or the receipt notification.
                  </p>
                </div>

                {/* Method display (read-only, shows what they picked) */}
                <div className='flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100'>
                  <span className={`w-3 h-3 rounded-full ${account.dot} flex-shrink-0`} />
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Paid via</p>
                    <p className={`font-bold text-sm ${account.textColor}`}>{account.label}</p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setStep(1)}
                    className='ml-auto text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2'
                  >
                    Change
                  </button>
                </div>

                {/* Reference input */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Reference Number
                  </label>
                  <div className='rounded-2xl border-2 border-gray-200 focus-within:border-[#1A1E43] transition-colors px-4 py-3.5'>
                    <input
                      type='text'
                      value={reference}
                      onChange={(e) => { setReference(e.target.value); setError(''); }}
                      placeholder='e.g. 1234567890'
                      className='w-full text-lg font-mono text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent'
                      autoFocus
                    />
                  </div>
                  <p className='text-xs text-gray-400 mt-1.5 ml-1'>
                    Usually 10–13 digits. Found in the {account.label} receipt or transaction history.
                  </p>
                </div>

                {/* ── Confirmation checkbox ──────────────────────────────── */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    confirmed
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className='relative flex-shrink-0 mt-0.5'>
                    <input
                      type='checkbox'
                      checked={confirmed}
                      onChange={(e) => { setConfirmed(e.target.checked); setError(''); }}
                      className='sr-only'
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        confirmed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {confirmed && <FaCheckCircle className='text-white text-xs' />}
                    </div>
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${confirmed ? 'text-emerald-800' : 'text-gray-700'}`}>
                      I confirm that I have already sent the payment
                    </p>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      By checking this, you confirm that{' '}
                      <strong>{formatCurrency(booking.total_price)}</strong> was sent via{' '}
                      {account.label} and the reference number above is correct.
                    </p>
                  </div>
                </label>

                {/* Error */}
                {error && (
                  <div className='flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
                    <span className='mt-0.5 flex-shrink-0'>⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isPending || !reference.trim() || !confirmed}
                  className='w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-lg active:scale-95'
                  style={{ background: 'linear-gradient(135deg, #1A1E43, #303879)' }}
                >
                  {isPending ? (
                    <><FaSpinner className='animate-spin' /> Submitting…</>
                  ) : (
                    'Submit Reference Number →'
                  )}
                </button>

                <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
                  <FaShieldAlt className='text-gray-300' />
                  The host will verify your payment and confirm your booking
                </div>
              </div>
            </div>

            {/* Recap sidebar */}
            <div className='space-y-5'>
              {/* What you sent */}
              <div
                className='rounded-3xl p-5 text-white space-y-3'
                style={{ background: 'linear-gradient(135deg, #1A1E43, #303879)' }}
              >
                <p className='text-[10px] text-blue-200 font-bold uppercase tracking-widest'>You Sent</p>
                <p className='text-3xl font-bold'>{formatCurrency(booking.total_price)}</p>
                <p className='text-blue-200 text-sm'>
                  via {account.label} to {account.number}
                </p>
                <div className='border-t border-white/20 pt-3 space-y-1 text-sm text-blue-100'>
                  <p>📅 {formatDate(checkIn)} → {formatDate(checkOut)}</p>
                  <p>🌙 {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Where to find ref */}
              <div className='bg-white rounded-2xl border border-gray-100 p-4 space-y-3'>
                <p className='font-bold text-gray-800 text-sm'>
                  📋 Where to find your reference number
                </p>
                <div className='space-y-2 text-xs text-gray-600'>
                  <div className='flex items-start gap-2'>
                    <span
                      className={`w-4 h-4 rounded-full ${
                        selectedMethod === 'gcash' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                      } flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5`}
                    >
                      {account.label[0]}
                    </span>
                    <p>
                      Open <strong>{account.label}</strong> → tap the notification or go to{' '}
                      <strong>Transaction History</strong> → tap the transaction → copy the{' '}
                      <strong>Reference No.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}