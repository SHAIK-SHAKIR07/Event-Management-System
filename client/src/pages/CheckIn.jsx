import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '../utils/api';

export default function CheckIn() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = async (detectedCodes) => {
    if (!scanning || !detectedCodes?.length) return;
    setScanning(false);
    const qrToken = detectedCodes[0].rawValue;
    try {
      const res = await axios.post('/api/tickets/checkin', { qrToken });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed');
    }
  };

  const reset = () => { setResult(null); setError(null); setScanning(true); };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">QR Check-In</h1>
      {scanning && (
        <div className="rounded-xl overflow-hidden border-4 border-indigo-500">
          <Scanner onScan={handleScan} onError={err => setError(err.message)} />
        </div>
      )}
      {result && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-green-700">{result.message}</h2>
          <p className="text-gray-600 mt-2">👤 {result.ticket?.user?.name}</p>
          <p className="text-gray-600">🎫 {result.ticket?.tierName}</p>
          <button onClick={reset}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Scan Next
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
          <div className="text-5xl mb-3">❌</div>
          <h2 className="text-xl font-bold text-red-700">{error}</h2>
          <button onClick={reset}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}