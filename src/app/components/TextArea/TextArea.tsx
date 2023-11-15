import { ChangeEvent, FocusEvent } from "react";

interface CustomInputProps {
	label: string;
	value?: string | number;
	name: string;
	messageError?: string | undefined | false;
	placeholder: string;
	isRequired: boolean;
	onChangeText?: (text: string) => void;
	onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void; // Cambiado a HTMLTextAreaElement
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void; // Cambiado a HTMLTextAreaElement
}

export const TextArea = ({
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
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
			<textarea
				className={`text-white resize-none h-24 text-base font-normal bg-transparent p-2 border border-solid border-[#374151] rounded-md outline-none transition-all duration-200 ${
					messageError ? "border-red-500" : ""
				}  focus:border-[#0EA5E9] focus:border-1`}
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

TextArea.displayName = "CustomInput";
export default TextArea;
