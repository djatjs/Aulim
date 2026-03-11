import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ModalDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  className
}: ModalDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "fixed left-[50%] top-[50%] z-[200] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] px-4 sm:px-0 outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            className
          )}
        >
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800">
            <Dialog.Close className="absolute right-6 top-6 sm:right-8 sm:top-8 rounded-full p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            {icon && (
              <div className="flex items-center justify-center w-14 h-14 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6 text-blue-600 dark:text-blue-400">
                {icon}
              </div>
            )}

            <div className="text-center space-y-3 mb-8">
              <Dialog.Title className="text-2xl font-black text-slate-900 dark:text-white">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {description}
                </Dialog.Description>
              )}
            </div>

            {children && <div className="mb-8">{children}</div>}

            {footer && (
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
                {footer}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
