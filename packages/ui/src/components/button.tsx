import type * as React from "react";

interface ButtonProbs extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	onClick?: () => void;
}

export const Button = ({children, ...props}: ButtonProbs) => {
	return (
		<button
			className="bg-green-300 p-2 rounded-lg"
			{...props}
		>
			{children}
		</button>
	);
};
