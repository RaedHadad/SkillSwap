'use client';
import { useEffect, useState } from 'react';

export default function HealthPage() {
  const [status, setStatus] = useState('Checking API...');
  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then(r => r.json())
      .then(d => setStatus(JSON.stringify(d)))
      .catch(e => setStatus('Error: ' + e.message));
  }, []);
  return (
    <main style={{ padding: 24 }}>
      <h1>API Health</h1>
      <pre>{status}</pre>
    </main>
  );
}
