"use client";
import { Button } from "@nextui-org/react";
import { useFormik } from "formik";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import CustomInput from "./components/CustomInput/CustomInput";
import CustomSelect from "./components/CustomSelect/CustomSelect";
import DatePicker from "./components/DatePicker/DatePicker";
import TextArea from "./components/TextArea/TextArea";
import {
	OBJECT_ANGULE_SUNPOINT,
	OBJECT_ANGULO_LANDMARK,
	OBJECT_CAMPAIGN_NAME,
	OBJECT_METHOD_CAPTURE,
	OBJECT_OWNERS,
	OBJECT_STATE,
} from "./constants/constants";
import { IForm } from "./interfaces/form";
import { formValidationSchema } from "./utils/validations/form";

const initialValues: IForm = {
	investigator: "",
	remarks: "",
	anguleLandmark: "",
	state: "",
	sampleX: "",
	sampleY: "",

	campaignName: "",
	siteAcquisition: "",
	samplePointId: "",
	surveyId: 0,
	longitud: "",
	latitud: "",
	anguleSunpoint: "",
	dateAcquisition: "",
	captureMethod: "",
	parametersAcquisition: "",
	operator: "",
	owner: "",
};

export default function Home() {
	const [valuesForm, setValuesForm] = useState<IForm>(initialValues);

	function uploadSomething() {
		return new Promise((resolve) => setTimeout(resolve, 1500));
	}

	const getDownloads = async () => {
		try {
			console.log("success");
			const res = await fetch("/api/script", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				throw new Error(`Request failed with status: ${res.status}`);
			}

			const data = await res.json();
			console.log(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleSubmitForm = async (data: IForm) => {
		console.log(data);

		try {
			toast.promise(uploadSomething, {
				success: "Información recolectada",
				loading: "Ejecutando Script para obtención de data",
				error: "Ocurrió un error!",
			});
			const res = await fetch("/api/data", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) {
				throw new Error("Error al enviar la solicitud");
			} else {
				formik.setValues(initialValues);
			}
		} catch (error) {
			console.error("Error durante la solicitud:", error);
			toast.error("Ocurrió un error al enviar la solicitud");
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validateOnChange: true,
		validateOnBlur: true,
		validationSchema: formValidationSchema,
		onSubmit: (values) => {
			handleSubmitForm(values);
		},
	});

	return (
		<div className="flex min-h-screen items-center flex-col gap-8 dark text-foreground container mx-auto py-8">
			<div className="title max-w-2xl ">
				<p className="text-xl text-[#9CA3AF] pt-4">
					Formulario de recopilación de información para el proyecto FACSAT-2
				</p>
			</div>
			<div className="bg-[#18181b] bg-opacity-80 p-8 rounded-lg max-w-2xl w-full shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.04),0px_20px_25px_-5px_rgba(0,0,0,0.10)]">
				<form>
					<p className="font-medium text-2xl">Digite los campos</p>
					<p className="text-sm text-[#9CA3AF] py-2">
						Los campos con (*) son obligatorios.
					</p>
					<div className="pt-2">
						<CustomInput
							label="Survey ID:"
							value={formik.values.surveyId}
							name="surveyId"
							placeholder="Calibración Operación"
							messageError={formik.errors.surveyId}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomSelect
							label="Campaign Name:"
							name="campaignName"
							onChangeSelect={(value) =>
								formik.setFieldValue("campaignName", value)
							}
							options={OBJECT_CAMPAIGN_NAME}
							messageError={formik.errors.campaignName}
							isRequired
						/>

						<CustomInput
							label="Investigador"
							value={formik.values.investigator}
							name="investigator"
							placeholder="Lorena Paola Cárdenas"
							messageError={formik.errors.investigator}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<TextArea
							label="Remarks"
							value={formik.values.remarks}
							name="remarks"
							placeholder="Descripción u observaciones de la campaña"
							messageError={formik.errors.remarks}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label="Lugar de adquisición:"
							value={formik.values.siteAcquisition}
							name="siteAcquisition"
							placeholder="Salt lake city"
							messageError={formik.errors.siteAcquisition}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label="Sample Point ID:"
							value={formik.values.samplePointId}
							name="samplePointId"
							placeholder="a2k_data_42"
							messageError={formik.errors.samplePointId}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label="Sample Point X:"
							value={formik.values.sampleX}
							name="sampleX"
							placeholder="0,0"
							messageError={formik.errors.sampleX}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<CustomInput
							label="Sample Point Y:"
							value={formik.values.sampleY}
							name="sampleY"
							placeholder="0,0"
							messageError={formik.errors.sampleY}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label="Longitud:"
							value={formik.values.longitud}
							name="longitud"
							placeholder="112.97 W"
							messageError={formik.errors.longitud}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<CustomInput
							label="Latitud:"
							value={formik.values.latitud}
							name="latitud"
							placeholder="40.94 N "
							messageError={formik.errors.latitud}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<CustomSelect
							label="Angulo de sunpoint:"
							name="anguloSunpoint"
							onChangeSelect={(value) =>
								formik.setFieldValue("anguleSunpoint", value)
							}
							options={OBJECT_ANGULE_SUNPOINT}
							messageError={formik.errors.anguleSunpoint}
							isRequired
						/>
						<DatePicker
							label="Fecha de adquisición:"
							value={formik.values.dateAcquisition}
							name="dateAcquisition"
							messageError={formik.errors.dateAcquisition}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomSelect
							label="Método de captura:"
							name="captureMethod"
							onChangeSelect={(value) =>
								formik.setFieldValue("captureMethod", value)
							}
							options={OBJECT_METHOD_CAPTURE}
							messageError={formik.errors.captureMethod}
							isRequired
						/>

						<CustomInput
							label="Parámetro de adquisición:"
							value={formik.values.parametersAcquisition}
							name="parametersAcquisition"
							placeholder="256 ms  2 scan integration 1"
							messageError={formik.errors.parametersAcquisition}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<CustomInput
							label="Operador:"
							value={formik.values.operator}
							name="operator"
							placeholder="LPC"
							messageError={formik.errors.operator}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomSelect
							label="Propietario"
							name="owner"
							onChangeSelect={(value) => formik.setFieldValue("owner", value)}
							options={OBJECT_OWNERS}
							messageError={formik.errors.owner}
							isRequired
						/>

						<CustomSelect
							label="Angulo Landmark"
							name="anguleLandmark"
							onChangeSelect={(value) =>
								formik.setFieldValue("anguleLandmark", value)
							}
							options={OBJECT_ANGULO_LANDMARK}
							messageError={formik.errors.anguleLandmark}
							isRequired
						/>

						<CustomSelect
							label="Estado"
							name="state"
							onChangeSelect={(value) => formik.setFieldValue("state", value)}
							options={OBJECT_STATE}
							messageError={formik.errors.state}
							isRequired
						/>
					</div>

					<Button
						color="primary"
						onPress={getDownloads}
						className="flex justify-center mx-auto mt-4"
					>
						Enviar
					</Button>
				</form>
			</div>
			<Toaster />
		</div>
	);
}
