'use client';
import { useState, useEffect } from 'react';

export default function HealthPage() {
  const [status, setStatus] = useState('Checking API...');

  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then((res) => res.json())
      .then((data) => setStatus(JSON.stringify(data)))
      .catch((err) => setStatus('Error: ' + err.message));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>API Health Check</h1>
      <p>{status}</p>
    </main>
  );
}
