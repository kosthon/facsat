import { Schema, model, models } from "mongoose";

const dataSchema = new Schema(
	{
		// DATA FROM FORM
		investigator: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		remarks: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		anguleLandmark: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		state: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		sampleX: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		sampleY: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		campaignName: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		siteAcquisition: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		samplePointId: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		surveyId: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		longitud: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		latitud: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		anguleSunpoint: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		dateAcquisition: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		captureMethod: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		parametersAcquisition: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		operator: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		owner: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		// DATA FROM WEB SCRAPPING
		// id: {
		// 	type: String,
		// 	required: [true, "El campo es requerido"],
		// 	trim: true,
		// },
		temperature: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		pressure: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		localTime: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		julianTime: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		utcTime: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		altitude: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		elevation: {
			type: String,
			required: [true, "El campo es requerido"],
			trim: true,
		},
		TLE: {
			type: Object,
			required: [true, "El campo es requerido"],
			trim: true,
		},

		isCordenadas: {
			type: String,
			required: [false],
		},
	},
	{
		timestamps: true, //TODO createdAT, updatedAT
		versionkey: false,
	},
);

export default models.Data || model("Data", dataSchema);
