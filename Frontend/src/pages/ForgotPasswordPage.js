import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError(true);
      setMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError(false);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'We have sent a password reset link to your email.');
        setError(false);
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setError(true);
      }
    } catch (error) {
      setMessage('Failed to connect to the server. Please try again later.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-4">Password Reset</h3>
        <hr className="mb-4" />
        <p className="text-gray-600 text-center mb-6">
          Forgotten your password? Enter your email address below, and we'll send you an email allowing you to reset it.
        </p>
        
        {message && (
          <div className={`mb-4 p-4 ${error ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'} rounded`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {error && <div className="text-sm text-red-600 mt-1">Required</div>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Reset My Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
