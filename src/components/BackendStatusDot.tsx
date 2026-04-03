import { useEffect, useState } from 'react';
import { checkExtractionHealth } from '@/services/extractionApi';

type DotStatus = 'active' | 'inactive' | 'construction' | 'degraded' | 'checking';

const BackendStatusDot = () => {
  const [status, setStatus] = useState<DotStatus>('checking');
  const [message, setMessage] = useState('Checking extraction backend...');

  const refresh = async () => {
    const result = await checkExtractionHealth();
    setStatus((result.status as DotStatus) || (result.ok ? 'active' : 'inactive'));
    setMessage(result.message);
  };

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      void refresh();
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const color =
    status === 'active'
      ? 'bg-green-500'
      : status === 'construction'
        ? 'bg-amber-500'
        : status === 'degraded'
          ? 'bg-yellow-500'
          : status === 'checking'
            ? 'bg-sky-500'
            : 'bg-red-500';

  const pulse = status === 'active' || status === 'checking' ? 'animate-pulse' : '';

  return (
    <button
      type="button"
      onClick={() => void refresh()}
      className="rounded-full p-1.5 hover:bg-accent/50"
      title={`${status.toUpperCase()}: ${message}`}
      aria-label={`Backend status ${status}. ${message}`}
    >
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color} ${pulse}`} />
    </button>
  );
};

export default BackendStatusDot;
