import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className
}: DropdownProps) {
  const selected = options.find((opt) => opt.value === value) || null;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block w-full", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center justify-between gap-2 w-full rounded-2xl border px-4 py-3 text-sm font-medium",
          "bg-white/60 dark:bg-neutral-900/90 backdrop-blur-md shadow-sm",
          "border-slate-200 dark:border-slate-700",
          "text-slate-800 dark:text-slate-200",
          "hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        )}
      >
        <span className="flex items-center gap-2">
            {selected?.icon && <span>{selected.icon}</span>}
            <span>{selected ? selected.label : placeholder}</span>
        </span>
        <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={cn(
            "absolute left-0 mt-2 w-full z-50 rounded-2xl overflow-hidden",
            "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl",
            "shadow-xl border border-slate-200 dark:border-slate-700",
            "animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          <div className="max-h-60 overflow-y-auto p-1 py-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 text-sm text-left transition-colors rounded-xl",
                  value === option.value
                    ? "bg-blue-50 dark:bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                )}
              >
                <div className="flex items-center gap-2">
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
                {value === option.value && (
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
