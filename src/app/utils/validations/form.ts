import * as Yup from "yup";

export const formValidationSchema = Yup.object().shape({
	siteAcquisition: Yup.string()
		.required(
			"El campo lugar de adquisición es requerido y no debe superar los 32 caracteres",
		)
		.min(2)
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
		.min(2)
		.max(32),
	longitud: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo longitud es requerido")
		.min(0.1)
		.max(1000)
		.test("is-decimal", "Debe ser un valor decimal", (value) => {
			if (value === undefined || value === null) return true; // Allow empty values
			return /^[0-9]*\.{1}[0-9]+$/.test(value.toString());
		}),
	latitud: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo latitud es requerido")
		.min(2)
		.test("is-decimal", "Debe ser un valor decimal", (value) => {
			if (value === undefined || value === null) return true; // Allow empty values
			return /^[0-9]*\.{1}[0-9]+$/.test(value.toString());
		}),
	anguleSunpoint: Yup.string().required("El campo es requerido").min(2),
	dateAcquisition: Yup.date().required("El campo es requerido").min(2),
	captureMethod: Yup.string().required("El campo es requerido").min(2),
	parametersAcquisition: Yup.string().required("El campo es requerido").min(2),
	operator: Yup.string().required("El campo es requerido").min(1).max(3),
	owner: Yup.string().required("El campo es requerido").min(2),
});
