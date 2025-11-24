import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RsvpStatus, GuestFormData } from '../types';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: RsvpStatus;
  onSubmit: (data: GuestFormData) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onClose, status, onSubmit }) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    guestsCount: 1,
    status: status
  });

  // Reset form when status changes, or when opening
  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, status }));
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const isAttending = status === RsvpStatus.ATTENDING;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-6 text-center ${isAttending ? 'bg-holiday-green' : 'bg-slate-700'} text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="font-serif text-2xl font-bold mb-1">
            {isAttending ? 'Wonderful!' : 'We will miss you'}
          </h2>
          <p className="text-white/80 text-sm">
            {isAttending ? 'Please complete your registration below.' : 'Thank you for letting us know.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-holiday-green/20 focus:border-holiday-green outline-none transition-all"
              placeholder="Santa Claus"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {isAttending && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-holiday-green/20 focus:border-holiday-green outline-none transition-all"
                value={formData.guestsCount}
                onChange={e => setFormData({...formData, guestsCount: parseInt(e.target.value)})}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md active:scale-[0.98] ${
              isAttending 
                ? 'bg-holiday-green hover:bg-green-800 shadow-green-900/10' 
                : 'bg-slate-700 hover:bg-slate-800 shadow-slate-900/10'
            }`}
          >
            Confirm RSVP
          </button>
        </form>
      </div>
    </div>
  );
};