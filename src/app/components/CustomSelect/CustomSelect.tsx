import { ChangeEvent, FocusEvent } from "react";

interface CustomSelectProps {
	label: string;
	value?: string;
	name: string;
	options: { value: string; label: string }[];
	messageError?: string | undefined | false;
	isRequired: boolean;
	onChangeSelect?: (value: string) => void;
	onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	formikValues: Record<string, any>;
}

export const CustomSelect = ({
	label,
	name,
	options,
	messageError,
	isRequired = true,
	onChangeSelect,
	onBlur,
	formikValues, // Recibe formik.values como prop
}: CustomSelectProps) => {
	// Usa formikValues.campaignName en lugar de formik.values.campaignName
	const selectedValue = formikValues[name];

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		if (onChangeSelect) {
			onChangeSelect(e.target.value);
		}
	};

	return (
		<div className="flex flex-col py-2">
			<label className="text-white text-base" htmlFor={name}>
				{label} {isRequired && <span className="text-[#0EA5E9]">*</span>}
			</label>
			<select
				className={`text-white text-base font-normal bg-transparent p-2 border border-solid border-[#374151] rounded-md outline-none transition-all duration-200 ${
					messageError ? "border-red-500" : ""
				} focus:border-[#0EA5E9] focus:border-1`}
				name={name}
				value={selectedValue}
				onChange={handleChange}
				onBlur={onBlur}
			>
				<option value="0" className="bg-[#0F172A]">
					Selecciona una opción
				</option>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
						className="bg-[#0F172A]"
					>
						{option.label}
					</option>
				))}
			</select>
			{messageError && <p className="text-xs text-red-500">{messageError}</p>}
		</div>
	);
};

export default CustomSelect;
