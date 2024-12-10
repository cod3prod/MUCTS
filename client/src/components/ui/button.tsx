import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Button(props: ComponentPropsWithoutRef<"button">) {
  const { children, className, ...rest } = props;
  return (
    <button
      className={twMerge(
        "px-3 py-2 rounded-md text-sm font-medium",
        "bg-primary text-white",
        "hover:bg-primary-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary-focus",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
