import { ChangeEvent, FocusEvent, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

interface DatePickerProps {
	label: string;
	value?: string;
	name: string;
	messageError?: string | undefined | false;
	isRequired: boolean;
	onChangeText?: (text: string) => void;
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const DatePicker = ({
	label,
	value,
	name,
	messageError,
	isRequired = true,
	onChangeText,
	onChange,
	onBlur,
}: DatePickerProps) => {
	const [valueInput, setValueInput] = useState({
		startDate: null,
		endDate: null,
	});

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleValueChange = (newValue: any) => {
		console.log("newValue:", newValue);

		// Actualiza el estado local y notifica a la función onChange si se proporciona.
		setValueInput(newValue);
		if (onChange) {
			onChange({
				target: { name, value: newValue.startDate },
			} as ChangeEvent<HTMLInputElement>);
		}
	};

	return (
		<div className="flex flex-col py-2">
			<label className="text-white text-base">
				{label} {isRequired && <span className="text-[#0EA5E9]">*</span>}
			</label>
			<Datepicker
				asSingle={true}
				useRange={false}
				value={valueInput}
				inputName={name}
				onChange={handleValueChange}
				inputClassName={`w-full text-white text-base font-normal bg-transparent p-2 border border-solid border-[#374151] rounded-md outline-none transition-all duration-200 ${
					messageError ? "border-red-500" : ""
				}  focus:border-[#0EA5E9] focus:border-1`}
			/>
			{messageError && <p className="text-xs text-red-500">{messageError}</p>}
		</div>
	);
};

export default DatePicker;
