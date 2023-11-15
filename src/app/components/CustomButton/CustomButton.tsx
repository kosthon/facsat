import { memo } from "react";

interface Props {
	title: string;
	onPress: () => void;
	className?: string;
	style?: {};
}

export const CustomButton = memo(
	({
		title,
		onPress,
		className = "flex self-center px-6 py-2 mx-auto mt-4 mb-0 text-white text-center font-bold bg-[#0EA5E9] rounded-md hover:bg-blue-800 transition-all",
		style,
	}: Props) => {
		return (
			<button
				type="button"
				onClick={onPress}
				className={className}
				style={{
					...style,
				}}
			>
				{title}
			</button>
		);
	},
);

CustomButton.displayName = "CustomButton";
export default CustomButton;
