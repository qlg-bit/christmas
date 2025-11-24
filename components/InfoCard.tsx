import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  details: string[];
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, details }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 space-y-3">
      <div className="p-3 bg-holiday-green/10 rounded-full text-holiday-green">
        <Icon size={24} />
      </div>
      <h3 className="font-serif text-lg font-semibold text-slate-900">{title}</h3>
      <div className="text-slate-600 text-sm leading-relaxed">
        {details.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
};
