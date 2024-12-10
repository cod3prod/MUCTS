import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Input = forwardRef<HTMLInputElement, ComponentPropsWithRef<"input">>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          "w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
