import { useEffect, useState } from 'react';
import { checkExtractionHealth } from '@/services/extractionApi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DotStatus = 'active' | 'inactive' | 'construction' | 'degraded' | 'checking';

const BackendStatusDot = () => {
  const [status, setStatus] = useState<DotStatus>('checking');
  const [detailMessage, setDetailMessage] = useState('Checking extraction backend...');
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    const result = await checkExtractionHealth();
    setStatus((result.status as DotStatus) || (result.ok ? 'active' : 'inactive'));
    setDetailMessage(result.message || 'Status check completed');
  };

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 640px)').matches);
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
  const statusLabel =
    status === 'active'
      ? 'Active'
      : status === 'construction'
        ? 'Construction'
        : status === 'degraded'
          ? 'Inactive'
        : status === 'checking'
          ? 'Active'
          : 'Inactive';

  const handleClick = () => {
    void refresh();
    if (isMobile) {
      setOpen(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className="rounded-full p-1.5 hover:bg-accent/50"
          title={statusLabel}
          aria-label={statusLabel}
        >
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${color} ${pulse}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 sm:hidden">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Backend Status</p>
          <p className="text-sm">{statusLabel}</p>
          <p className="text-xs text-muted-foreground">{detailMessage}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BackendStatusDot;
