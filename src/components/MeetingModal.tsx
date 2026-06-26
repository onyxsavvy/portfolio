import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon } from 'lucide-react';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configurable Calendly link (Update this to client's specific Calendly link)
const CALENDLY_USERNAME = import.meta.env.VITE_CALENDLY_USERNAME || 'onyxsavvy02';
const CALENDLY_EVENT_TYPE = import.meta.env.VITE_CALENDLY_EVENT_TYPE || '30min';

export default function MeetingModal({ isOpen, onClose }: MeetingModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Construct Calendly URL with custom themes matching OnyxSavvy
  const calendlyUrl = `https://calendly.com/${CALENDLY_USERNAME}/${CALENDLY_EVENT_TYPE}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0e0e0e&text_color=ffffff&primary_color=a3e635`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[760px] md:max-w-[840px] p-0 overflow-hidden border border-border bg-[#0E0E0E]/95 backdrop-blur-xl rounded-2xl shadow-2xl h-[700px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border bg-card/20 shrink-0">
          <DialogTitle className="font-display font-medium text-xl text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-accent" />
            Schedule a Consultation
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-xs">
            Select a date and time slot from the calendar below. We will automatically sync the calendar invite.
          </DialogDescription>
        </DialogHeader>

        {/* Content Container (Iframe) */}
        <div className="flex-1 relative w-full h-full bg-[#0E0E0E] overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] z-50">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-text-secondary text-xs font-sans tracking-wide">
                Loading scheduling calendar...
              </span>
            </div>
          )}

          {isOpen && (
            <iframe
              src={calendlyUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              onLoad={() => setIsLoading(false)}
              className="w-full h-full rounded-b-2xl"
              title="Calendly Scheduler"
              style={{ minHeight: '100%' }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
