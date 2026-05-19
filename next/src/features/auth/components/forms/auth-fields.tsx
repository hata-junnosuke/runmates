'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { FormControl } from '@/components/ui/form';

export const labelClass = 'text-xs font-semibold text-[#3a4a63]';
// 認証フォーム内でのみ使用するため非 export（外部から参照しない）
const inputClass =
  'w-full rounded-xl border border-[#E5EAF1] bg-white px-[42px] py-3 text-sm text-[#0F1A2B] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#3B8FE3] focus:shadow-[0_0_0_4px_rgba(59,143,227,0.12)] disabled:opacity-60';
export const messageClass = 'mt-1.5 text-xs text-[#dc2626]';
export const submitButtonClass =
  'mt-1.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[#3B8FE3] py-[14px] text-sm font-bold tracking-[0.02em] text-white shadow-[0_6px_14px_rgba(59,143,227,0.3)] transition-colors duration-150 hover:bg-[#2B7BD0] disabled:cursor-not-allowed disabled:opacity-60';

const iconClass =
  'pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 text-[#6b7a90]';

type FieldProps<T extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  disabled?: boolean;
  autoComplete?: string;
};

export function EmailControl<T extends FieldValues>({
  field,
  disabled,
}: FieldProps<T>) {
  return (
    <div className="relative">
      <Mail size={16} strokeWidth={1.8} className={iconClass} />
      <FormControl>
        <input
          type="email"
          className={inputClass}
          autoComplete="email"
          disabled={disabled}
          {...field}
        />
      </FormControl>
    </div>
  );
}

export function PasswordControl<T extends FieldValues>({
  field,
  disabled,
  autoComplete = 'current-password',
}: FieldProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Lock size={16} strokeWidth={1.8} className={iconClass} />
      <FormControl>
        <input
          type={show ? 'text' : 'password'}
          className={inputClass}
          autoComplete={autoComplete}
          disabled={disabled}
          {...field}
        />
      </FormControl>
      <button
        type="button"
        className="absolute top-1/2 right-[14px] flex -translate-y-1/2 cursor-pointer text-[#6b7a90]"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'パスワードを隠す' : 'パスワードを表示'}
      >
        {show ? (
          <EyeOff size={16} strokeWidth={1.8} />
        ) : (
          <Eye size={16} strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}
