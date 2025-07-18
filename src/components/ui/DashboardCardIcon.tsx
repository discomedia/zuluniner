import { ReactNode } from 'react';

export function DashboardCardIcon({ icon, bg }: { icon: ReactNode; bg?: string }) {
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${bg || 'bg-primary-100'}`}
      aria-hidden="true"
    >
      {icon}
    </div>
  );
}
