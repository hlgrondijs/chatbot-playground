import type { MouseEventHandler } from "react";

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: string;
}

export const Button = ({ onClick, label }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="m-1 h-[40px] rounded bg-gray-300 p-2 px-4"
    >
      {label}
    </button>
  );
};
