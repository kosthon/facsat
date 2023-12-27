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
		.integer("El valor debe ser un número")
		.min(-32768, "El número debe ser mayor o igual a -32,768")
		.max(32767, "El número debe ser menor o igual a 32,767"),

	surveyId: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo es obligatorio"),

	longitud: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo es obligatorio")
		.min(-90, "La longitud no puede ser menor que -90")
		.max(90, "La longitud no puede ser mayor que 90"),

	latitud: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo es obligatorio")
		.min(-180, "La latitud no puede ser menor que -180")
		.max(180, "La latitud no puede ser mayor que 180"),

	// isCordenadas: Yup.boolean(),

	// longitud: Yup.number().when("isCordenadas", {
	// 	is: true,
	// 	then: Yup.number()
	// 		.typeError("El valor debe ser un número")
	// 		.required("El campo longitud es requerido")
	// 		.min(-90, "La longitud no puede ser menor que -90")
	// 		.max(90, "La longitud no puede ser mayor que 90"),
	// 	otherwise: Yup.number().notRequired(),
	// }),

	// latitud: Yup.number().when("isCordenadas", {
	// 	is: true,
	// 	then: Yup.number()
	// 		.typeError("El valor debe ser un número")
	// 		.required("El campo latitud es requerido")
	// 		.min(-180, "La latitud no puede ser menor que -180")
	// 		.max(180, "La latitud no puede ser mayor que 180"),
	// 	otherwise: Yup.number().notRequired(),
	// }),

	anguleSunpoint: Yup.string()
		.required("El campo es requerido")
		.min(2, "El campo no puede ser menor a 2 caracteres"),
	dateAcquisition: Yup.date().required("El campo es requerido"),
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
		.required("El campo longitud es requerido"),
	sampleY: Yup.number()
		.typeError("El valor debe ser un número")
		.required("El campo longitud es requerido"),
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
