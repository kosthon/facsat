import { ChangeEvent, FocusEvent } from "react";

interface CustomInputProps {
	label: string;
	value?: string | number;
	name: string;
	messageError?: string | undefined | false;
	placeholder: string;
	isRequired: boolean;
	onChangeText?: (text: string) => void;
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = ({
	label,
	value,
	name,
	messageError,
	placeholder,
	isRequired = true,
	onChangeText,
	onChange,
	onBlur,
}: CustomInputProps) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e); // Llama a la función onChange si está definida
		}
		if (onChangeText) {
			onChangeText(e.target.value);
		}
	};

	return (
		<div className="flex flex-col py-2">
			<label className="text-white text-base">
				{label} {isRequired && <span className="text-[#0EA5E9]">*</span>}
			</label>
			<input
				className={`text-white text-base font-normal bg-transparent p-2 border border-solid border-[#374151] rounded-md outline-none transition-all duration-200 ${
					messageError ? "border-red-500" : ""
				}  focus:border-[#0EA5E9] focus:border-1`}
				type="text"
				name={name}
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				onBlur={onBlur}
			/>
			{messageError && <p className="text-xs text-red-500">{messageError}</p>}
		</div>
	);
};

CustomInput.displayName = "CustomInput";
export default CustomInput;
