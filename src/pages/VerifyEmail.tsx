import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    apiClient
      .get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <>
          <h2>Email Verified </h2>
          <p>You can now sign in to your account.</p>
          <button onClick={() => navigate('/signin')}>Go to Sign In</button>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>Verification Failed </h2>
          <p>The token is invalid or expired.</p>
        </>
      )}
    </div>
  );
}
