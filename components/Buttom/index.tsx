import React, { FC, ReactNode } from "react";

interface ICustomButtonProps {
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  children?: ReactNode;
}

const Button: FC<ICustomButtonProps> = ({
  loading,
  className,
  onClick,
  disabled,
  type,
  children,
}: ICustomButtonProps) => {
  return (
    <button
      className={`${className}`}
      disabled={loading || disabled}
      onClick={onClick}
      type={type ? type : "button"}
    >
      {loading ? "loading" : children}
    </button>
  );
};

export default Button;
