import React, { useState, useRef } from 'react';
import { Plus, ArrowRight, Image as ImageIcon, RotateCcw, Upload } from 'lucide-react';

interface HeroBannerProps {
  onStartNewAnalysis: () => void;
  onViewRecommendations: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartNewAnalysis,
  onViewRecommendations,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heroImage, setHeroImage] = useState<string>(() => {
    return (
      localStorage.getItem('packwise_hero_bg') ||
      '/ChatGPT Image Sep 29, 2026, 09_54_43 AM.png'
    );
  });
  const [isCustom, setIsCustom] = useState<boolean>(() => {
    return !!localStorage.getItem('packwise_hero_bg');
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        try {
          localStorage.setItem('packwise_hero_bg', dataUrl);
          setHeroImage(dataUrl);
          setIsCustom(true);
        } catch (err) {
          console.warn('Storage quota exceeded, using in-memory image', err);
          setHeroImage(dataUrl);
          setIsCustom(true);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('packwise_hero_bg');
    } catch {}
    setHeroImage('/ChatGPT Image Sep 29, 2026, 09_54_43 AM.png');
    setIsCustom(false);
  };

  return (
    <section
      className="relative w-full min-w-0 rounded-2xl md:rounded-[20px] bg-[var(--bg-hero)] border border-[var(--border-hero)] p-6 sm:p-8 lg:p-9 overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300"
      style={{
        backgroundImage: `url("${heroImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Hidden file input for uploading custom header image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Light gradient overlay to ensure maximum contrast and legibility for text */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-200"
        style={{
          background:
            'linear-gradient(to right, rgba(245, 248, 246, 0.96) 0%, rgba(245, 248, 246, 0.88) 35%, rgba(245, 248, 246, 0.40) 60%, rgba(245, 248, 246, 0.05) 100%)',
        }}
      />

      {/* Radial emerald atmospheric glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle, var(--brand-primary) 0%, var(--brand-dark) 50%, transparent 75%)',
        }}
      />

      {/* Top-right Image Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {isCustom && (
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-card)]/90 backdrop-blur-md hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] shadow-xs transition-all cursor-pointer"
            title="Reset to default banner"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Banner</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-card)]/90 backdrop-blur-md hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] shadow-xs transition-all cursor-pointer"
          title="Upload or change header image"
        >
          <Upload className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span className="hidden sm:inline">{isCustom ? 'Change Image' : 'Upload Banner'}</span>
          <span className="sm:hidden">Banner</span>
        </button>
      </div>

      {/* Main Grid: Left copy & actions | Right Column showcasing panoramic artwork */}
      <div className="relative z-10 grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[290px]">
        {/* Left Column (Text & CTAs) */}
        <div className="min-w-0 lg:col-span-7 flex flex-col justify-center space-y-4">
          {/* Engineering Domain Kicker */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold tracking-widest uppercase text-[var(--brand-primary)]">
              AI-POWERED
            </span>
            <span className="h-[2px] w-12 bg-[var(--accent-gold)] rounded-full"></span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight">
            <span className="text-[var(--text-primary)]">Food Packaging </span>
            <span className="text-[var(--brand-primary)]">Solutions</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-lg font-normal pt-1">
            Get intelligent packaging material recommendations based on your food product, storage conditions and supply chain.
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-text)] transition-all duration-150 shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Analysis</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={onViewRecommendations}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-cta)] transition-all duration-150 cursor-pointer"
            >
              <span>View Recommendations</span>
              <ArrowRight className="w-4 h-4 ml-0.5 text-[var(--text-primary)]" />
            </button>
          </div>
        </div>

        {/* Right Column: Preserves grid layout to let the background artwork shine through */}
        <div
          className="min-w-0 lg:col-span-5 min-h-[140px] sm:min-h-[200px] lg:min-h-[290px]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
