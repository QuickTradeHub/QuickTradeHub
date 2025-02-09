import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
      const response = await fetch('http://13.49.132.61:8080/auth/forgot-password', {
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-300 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-2xl shadow-2xl">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">Reset Your Password</h3>
        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
          Enter your email address below, and we'll send you instructions to reset your password.
        </p>
        
        {message && (
          <div className={`mb-4 p-3 md:p-4 rounded-lg text-center ${error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
              disabled={loading}
            />
            {error && <span className="text-sm text-red-500 absolute bottom-[-18px] left-0">Required</span>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 md:mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200 text-sm md:text-base">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
