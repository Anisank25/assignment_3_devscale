import type * as React from "react";

interface ButtonProbs {
	children: React.ReactNode;
	onClick?: () => void;
}

export const Button = (props: ButtonProbs) => {
	return (
		<button
			type="button"
			className="bg-green-300 p-2 rounded-lg"
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

<p className="bg-red-500 text-white p-2">
  Tailwind Test
</p>
