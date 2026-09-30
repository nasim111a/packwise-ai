import React, { useState } from 'react';
import { Search, Bell, Settings, Menu, X, ShieldCheck } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onOpenSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Packaging Analysis Completed',
      desc: 'Tomato clamshell PLA barrier profile calculated (WVTR 18.4 g/m²/24h).',
      time: '12m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Regulatory Norm Updated',
      desc: 'EU Directive 94/62/EC packaging waste compliance matrix synced.',
      time: '2h ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'Material Database Refresh',
      desc: 'Added 4 new seaweed alginate & PHA high-barrier biopolymers.',
      time: '1d ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-30 h-16 min-w-0 bg-[var(--bg-topbar)] backdrop-blur-md border-b border-[var(--border-primary)] px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-2xl mr-2">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full min-w-0 max-w-[460px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search analyses, products, materials, or insights..."
            className="w-full pl-10 pr-9 py-2 text-[13px] bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Compliance badge | Notification | Settings */}
      <div className="flex items-center gap-2 sm:gap-2.5 relative shrink-0">
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[11px] font-medium text-[var(--brand-primary)] mr-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span>ISO 22000 & FDA Compliant</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-primary)] bg-[var(--bg-card)] rounded-xl transition-all relative shadow-xs cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent-red)] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-96 max-w-sm bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-[var(--text-primary)]">System Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)]">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--bg-card-elevated)] text-[var(--text-muted)]">
                      All caught up
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markItemRead(item.id)}
                      className={`py-3 px-2 rounded-lg transition-colors cursor-pointer group flex items-start justify-between gap-2 ${
                        item.read ? 'hover:bg-[var(--bg-card-hover)] opacity-75' : 'bg-[var(--badge-completed-bg)]/40 hover:bg-[var(--badge-completed-bg)]/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-[12.5px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                            {!item.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                            )}
                            <span className="truncate">{item.title}</span>
                          </h4>
                          <span className="text-[10px] text-[var(--text-muted)] shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => removeNotification(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded cursor-pointer transition-opacity"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    className="text-[11.5px] font-medium text-[var(--brand-primary)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:underline"
                  >
                    Mark all as reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifications([])}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-primary)] bg-[var(--bg-card)] rounded-xl transition-all shadow-xs cursor-pointer"
          aria-label="Platform settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
