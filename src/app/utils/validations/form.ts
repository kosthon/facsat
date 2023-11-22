import * as Yup from "yup";

export const formValidationSchema = Yup.object().shape({
	investigator: Yup.string()
		.required("El campo es requerido y no debe superar los 32 caracteres")
		.min(2, "El campo no puede ser menor a 2 caracteres")
		.max(32),

	remarks: Yup.string()
		.required("El campo es requerido y no debe superar los 200 caracteres")
		.min(2, "El campo no puede ser menor a 2 caracteres")
		.max(200, "El campo no puede superar los 200 caracteres"),
	siteAcquisition: Yup.string()
		.required(
			"El campo lugar de adquisición es requerido y no debe superar los 32 caracteres",
		)
		.min(2, "El campo no puede ser menor a 2 caracteres")
		.max(32),
	samplePointId: Yup.number()
		.required("El campo sample point es requerido")
		.integer("El valor debe ser un número entero")
		.min(-32768, "El número debe ser mayor o igual a -32,768")
		.max(32767, "El número debe ser menor o igual a 32,767"),
	surveyId: Yup.string()
		.required(
			"El campo survey ID es requerido y no debe superar los 32 caracteres",
		)
		.min(1, "El campo no puede ser menor a 1 caracter")
		.max(32),
	longitud: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo longitud es requerido")
		.test("is-decimal", "Debe ser un valor decimal", (value) => {
			if (value === undefined || value === null) return true; // Allow empty values
			return /^[0-9]*\.{1}[0-9]+$/.test(value.toString());
		}),
	latitud: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo latitud es requerido")
		.test("is-decimal", "Debe ser un valor decimal", (value) => {
			if (value === undefined || value === null) return true; // Allow empty values
			return /^[0-9]*\.{1}[0-9]+$/.test(value.toString());
		}),
	anguleSunpoint: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	dateAcquisition: Yup.date()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	captureMethod: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	parametersAcquisition: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	operator: Yup.string()
		.required("El campo es requerido")
		.min(1, "El campo no puede ser menor a 3 caracteres")
		.max(3, "El campo no debe superar los 3 caracteres"),
	owner: Yup.string().required("El campo es requerido").min(2),
	sampleX: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo latitud es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres")
		.test("is-decimal", "Debe ser un valor decimal", (value) => {
			if (value === undefined || value === null) return true; // Allow empty values
			return /^[0-9]*\.{1}[0-9]+$/.test(value.toString());
		}),
	sampleY: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo latitud es requerido")
		.min(2)
		.test("is-decimal", "Debe ser un valor decimal", (value) => {
			if (value === undefined || value === null) return true; // Allow empty values
			return /^[0-9]*\.{1}[0-9]+$/.test(value.toString());
		}),
	anguleLandmark: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	state: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	campaignName: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
});
