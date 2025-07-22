import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          className="w-full bg-surface border border-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
