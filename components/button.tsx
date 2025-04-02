// components/button.tsx
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`text-white px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
