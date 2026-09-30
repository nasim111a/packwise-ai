import React, { useState } from 'react';
import { X, CircleHelp, Search, ChevronDown, ChevronUp, Send, Check } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'handbook'>('faq');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Contact form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does PackWise calculate recommended OTR and WVTR barrier values?',
      a: 'PackWise models the product respiration rate (RO₂) and equilibrium relative humidity (ERH) against target shelf-life duration using Fick’s second law of diffusion. This derives precise Oxygen Transmission Rate (OTR in cc/m²/24h) and Water Vapor Transmission Rate (WVTR in g/m²/24h) thresholds needed to prevent both oxidative/microbial degradation and moisture desiccation.',
    },
    {
      q: 'Which international food contact compliance standards are supported?',
      a: 'All generated material specifications are cross-audited against US FDA 21 CFR § 177 (polymers), European Union Framework Regulation (EC) No 1935/2004, EU Plastics Regulation (EU) 10/2011, and FSSAI 2018 packaging regulations for overall migration limits (OML).',
    },
    {
      q: 'What is the difference between industrial vs home compostable certifications?',
      a: 'EN 13432 & ASTM D6400 mandate disintegration (>90% within 180 days) under industrial high-temperature conditions (58°C). Home compostability (OK Compost Home / AS 5810) requires disintegration at ambient temperatures (20°C–30°C) within 12 months without toxic ecotoxicity residue.',
    },
    {
      q: 'How can I export technical data sheets (TDS) for supplier procurement?',
      a: 'Navigate to any analysis card or the Reports & Compliance tab. Click "Download TDS" or "Export TDS" to generate an audit-ready specification file containing gas transmission rates, seal strength requirements, and LCA carbon indices.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSubject('');
        setMessage('');
        setActiveTab('faq');
      }, 1800);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transition-colors duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-secondary)] flex items-center justify-between bg-[var(--bg-card-elevated)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)]">
              <CircleHelp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Help & Engineering Support</h3>
              <p className="text-xs text-[var(--text-muted)]">Technical documentation & methodology guides</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[var(--border-secondary)] bg-[var(--bg-card)] px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Knowledge & FAQs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Submit Inquiry
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search technical answers, barrier units, standards..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div className="space-y-2 pt-1">
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[var(--border-primary)] rounded-xl overflow-hidden bg-[var(--bg-card-elevated)] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                        className="w-full p-3 text-left flex items-center justify-between gap-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3.5 pb-3 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-secondary)] pt-2 bg-[var(--bg-card)]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Inquiry Topic / Product Case
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. EVOH vs Bio-PLA barrier for tropical export"
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                  Technical Question or Barrier Challenge
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe food commodity moisture activity, storage temperatures, target shelf life..."
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] resize-none"
                />
              </div>

              {submitted ? (
                <div className="p-3 rounded-xl bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Ticket #PW-{Math.floor(1000 + Math.random() * 9000)} submitted. Engineering response queued!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-text)] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send to Engineering Team'}</span>
                </button>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] flex justify-between items-center text-xs">
          <span className="text-[var(--text-muted)]">MoFPI & ISO 22000 Technical Repository</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
