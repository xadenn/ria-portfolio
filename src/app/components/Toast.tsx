"use client";

import { createContext, useContext, useState, useRef, type ReactNode } from "react";
import { Check, Sparkle, SpeakerHigh, SpeakerSlash, Copy } from "@phosphor-icons/react";

interface ToastContextType {
  showToast: (message: string, iconType?: "check" | "audio-on" | "audio-off" | "copy" | "sparkle") => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [iconType, setIconType] = useState<"check" | "audio-on" | "audio-off" | "copy" | "sparkle">("sparkle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    msg: string,
    type: "check" | "audio-on" | "audio-off" | "copy" | "sparkle" = "sparkle"
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    setIconType(type);
    setIsOpen(true);

    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 3200);
  };

  const renderIcon = () => {
    switch (iconType) {
      case "check":
        return <Check size={16} weight="bold" className="text-emerald-400" />;
      case "audio-on":
        return <SpeakerHigh size={16} weight="fill" className="text-indigo-400" />;
      case "audio-off":
        return <SpeakerSlash size={16} weight="light" className="text-white/50" />;
      case "copy":
        return <Copy size={16} weight="light" className="text-cyan-400" />;
      default:
        return <Sparkle size={16} weight="fill" className="text-indigo-400" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-50 pointer-events-none"
        aria-live="polite"
      >
        <div
          className={`t-toast ${isOpen ? "is-open" : ""} pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f0f18]/90 border border-white/15 backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.6)]`}
        >
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {renderIcon()}
          </div>
          <p className="text-xs font-mono text-white/90 tracking-wide">
            {message}
          </p>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
