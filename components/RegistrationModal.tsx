import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Masters Tier',
    ratingId: ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: submitError } = await supabase
      .from('players')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        rating_id: formData.ratingId,
        status: 'pending'
      }]);

    setIsSubmitting(false);

    if (submitError) {
      setError(submitError.message);
    } else {
      // Reset form and call success
      setStep(1);
      setFormData({ name: '', email: '', phone: '', category: 'Masters Tier', ratingId: '' });
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-reveal relative border border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-black/5 bg-white">
          <div className="flex gap-2 text-sm font-medium text-black/40">
            <span className={step >= 1 ? 'text-black' : ''}>01 Details</span>
            <span>—</span>
            <span className={step >= 2 ? 'text-black' : ''}>02 Profile</span>
            <span>—</span>
            <span className={step >= 3 ? 'text-black' : ''}>03 Review</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10 text-black/60 hover:text-black focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            
            {step === 1 && (
              <div className="space-y-6 animate-reveal">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium text-black tracking-tight mb-2">Personal Details</h2>
                  <p className="text-black/50 font-light text-sm">Register for the <strong>2nd Edition</strong> — March 7, 2026</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/[0.03] border-0 rounded-2xl px-6 py-4 text-black placeholder:text-black/30 focus:ring-2 focus:ring-noovo-yellow transition-shadow"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/[0.03] border-0 rounded-2xl px-6 py-4 text-black placeholder:text-black/30 focus:ring-2 focus:ring-noovo-yellow transition-shadow"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-black/[0.03] border-0 rounded-2xl px-6 py-4 text-black placeholder:text-black/30 focus:ring-2 focus:ring-noovo-yellow transition-shadow"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-reveal">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium text-black tracking-tight mb-2">Player Profile</h2>
                  <p className="text-black/50 font-light text-sm">Tell us about your competitive background for the 2nd Edition.</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Playing Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-black/[0.03] border-0 rounded-2xl px-6 py-4 text-black focus:ring-2 focus:ring-noovo-yellow transition-shadow appearance-none cursor-pointer"
                    >
                      <option value="Masters Tier">Masters Tier</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Opens Tier">Opens Tier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">WESPA / National Rating ID <span className="lowercase font-normal tracking-normal text-black/30">(Optional)</span></label>
                    <input 
                      type="text"
                      value={formData.ratingId}
                      onChange={e => setFormData({...formData, ratingId: e.target.value})}
                      className="w-full bg-black/[0.03] border-0 rounded-2xl px-6 py-4 text-black placeholder:text-black/30 focus:ring-2 focus:ring-noovo-yellow transition-shadow"
                      placeholder="e.g. 123456"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-reveal">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium text-black tracking-tight mb-2">Review & Submit</h2>
                  <p className="text-black/50 font-light text-sm">Confirm your details for The Wordsmiths Arena — 2nd Edition, March 7, 2026.</p>
                </div>
                
                <div className="bg-black/[0.03] border border-black/5 rounded-[2rem] p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Name</span>
                      <span className="text-black font-medium">{formData.name}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Phone</span>
                      <span className="text-black font-medium">{formData.phone}</span>
                    </div>
                    <div className="col-span-2 border-b border-black/5 pb-4">
                      <span className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Email</span>
                      <span className="text-black font-medium break-all">{formData.email}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Category</span>
                      <span className="text-black font-medium">{formData.category}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Rating ID</span>
                      <span className="text-black font-medium">{formData.ratingId || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 text-red-600 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-10 flex gap-4 pt-6 border-t border-black/5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-xl font-medium text-black bg-black/5 hover:bg-black/10 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> <span className="hidden sm:inline">Back</span>
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#111111] text-white font-medium py-4 rounded-xl hover:bg-black transition-colors shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {step < 3 ? (
                  <>Continue <ChevronRight size={20} /></>
                ) : (
                  <>{isSubmitting ? 'Registering...' : 'Submit Registration'} <CheckCircle2 size={20} /></>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};
