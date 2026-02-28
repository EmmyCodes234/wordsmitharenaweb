import React from 'react';
import { X, Check } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-reveal relative border border-white/20">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10 text-black/60 hover:text-black"
        >
          <X size={20} />
        </button>
        
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-noovo-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-noovo-yellow/30">
              <Check size={32} className="text-noovo-yellow" />
            </div>
            <h2 className="text-3xl font-medium text-black tracking-tight mb-4">Complete Your Registration</h2>
            <p className="text-black/60 leading-relaxed font-light text-sm">
              Once you've submitted your registration form, secure your spot by making your payment using the details below.
            </p>
          </div>

          <div className="bg-black/[0.03] border border-black/5 rounded-[2rem] p-6 sm:p-8 mb-8 space-y-6">
            <div className="flex flex-col border-b border-black/5 pb-4">
              <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">Bank Name</span>
              <span className="text-lg font-medium text-black">Guaranty Trust Bank (GTB)</span>
            </div>
            <div className="flex flex-col border-b border-black/5 pb-4">
               <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">Account Number</span>
               <span className="text-3xl font-medium text-black tracking-wider text-noovo-yellow drop-shadow-sm">
                 0916457333
               </span>
            </div>
            <div className="flex flex-col">
              <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">Account Name</span>
              <span className="text-lg font-medium text-black">Erigi Edafe</span>
            </div>
          </div>

          <a 
            href={`https://wa.me/2347034849762?text=${encodeURIComponent("I have made my payment for the 2nd Edition of The Wordsmiths Arena Open Scrabble Retreat 2026.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#111111] text-white font-medium py-4 rounded-xl hover:bg-black transition-colors shadow-xl active:scale-95"
            onClick={onClose}
          >
            I've Paid
          </a>
          
          <p className="text-center text-black/40 text-xs mt-6 font-light">
            Clicking "I've Paid" will open WhatsApp to verify your payment with the Director.
          </p>
        </div>
      </div>
    </div>
  );
};
