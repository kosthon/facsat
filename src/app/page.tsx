'use client';
import { Button, Divider, Switch } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import CustomInput from './components/CustomInput/CustomInput';
import CustomSelect from './components/CustomSelect/CustomSelect';
import DatePicker from './components/DatePicker/DatePicker';
import TextArea from './components/TextArea/TextArea';
import {
	API_KEY_VISUALCROSSING,
	OBJECT_ANGULE_SUNPOINT,
	OBJECT_ANGULO_LANDMARK,
	OBJECT_CAMPAIGN_NAME,
	OBJECT_METHOD_CAPTURE,
	OBJECT_OWNERS,
	OBJECT_STATE,
} from './constants/constants';
import { IForm } from './interfaces/form';
import { formValidationSchema } from './utils/validations/form';

const initialValues: IForm = {
	investigator: '',
	remarks: '',
	anguleLandmark: '',
	state: '',
	sampleX: '',
	sampleY: '',

	campaignName: '',
	siteAcquisition: '',
	samplePointId: '',
	surveyId: '',
	longitud: '',
	latitud: '',
	anguleSunpoint: '',
	dateAcquisition: '',
	captureMethod: '',
	parametersAcquisition: '',
	operator: '',
	owner: '',
};

export default function Home() {
	const [valuesForm, setValuesForm] = useState<IForm>(initialValues);
	const [isCordenadas, setIsCordenadas] = useState(true);

	const getTemperaturePressure = async (data: IForm) => {
		try {
			const response = await fetch(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data.longitud},${data.latitud}?unitGroup=metric&key=${API_KEY_VISUALCROSSING}&include=current&elements=temp,pressure`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			const responseData = await response.json();
			return responseData;
		} catch (error) {
			console.error('Error al realizar la petición:', error);
			throw error;
		}
	};

	const executeScript = async (data: IForm) => {
		const scriptResponse = await fetch('/api/script', {
			method: 'POST',
			body: JSON.stringify({
				longitud: data.longitud,
				latitud: data.latitud,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!scriptResponse.ok) {
			throw new Error(`Error: ${scriptResponse.status}`);
		}
		return scriptResponse.json();
	};

	const sendDataRequest = async (data: IForm) => {
		try {
			formik.validateForm(data);
			let scriptResult;
			let resultTemperaturePressure;
			let surveyId: string;

			if (data.campaignName === 'LEO') {
				surveyId = '001';
			} else if (data.campaignName === 'Commissioning') {
				surveyId = '002';
			} else if (data.campaignName === 'Operation') {
				surveyId = '003';
			}

			await toast.promise(
				async () => {
					resultTemperaturePressure = await getTemperaturePressure(data);
					scriptResult = await executeScript(data);
					if (scriptResult.success) {
						const lastRegister = scriptResult.ultimoResultado;
						const currentData = resultTemperaturePressure.currentConditions;
						const dataResponse = await fetch('/api/data', {
							method: 'POST',
							body: JSON.stringify({
								...data,
								temperature: currentData.temp,
								pressure: currentData.pressure,
								localTime: lastRegister.localTime,
								julianTime: lastRegister.julianTime,
								utcTime: lastRegister.utcTime,
								altitude: lastRegister.altitude,
								elevation: lastRegister.elevation,
								TLE: lastRegister.TLE,
								surveyId: surveyId,
							}),
							headers: {
								'Content-Type': 'application/json',
							},
						});
						const responseData = await dataResponse.json();
						formik.setValues(initialValues);
						return responseData;
					}
				},
				{
					loading: 'Ejecutando Script para obtención de data',
					success: 'Script ejecutado correctamente',
					error: error => {
						console.error('Error durante la ejecución del script:', error);
						return 'Ocurrió un error al ejecutar el script';
					},
				}
			);
		} catch (error) {
			console.error('Error durante la solicitud:', error);
			throw error;
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validateOnChange: true,
		validateOnBlur: true,
		validationSchema: formValidationSchema,
		onSubmit: values => {
			sendDataRequest(values);
		},
	});

	return (
		<div className='flex min-h-screen items-center flex-col gap-8 dark text-foreground container mx-auto py-8'>
			<div className='title max-w-2xl '>
				<p className='text-xl text-[#9CA3AF] pt-4'>
					Formulario de recopilación de información para el proyecto FACSAT-2
				</p>
			</div>
			<div className='bg-[#18181b] bg-opacity-80 p-8 rounded-lg max-w-2xl w-full shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.04),0px_20px_25px_-5px_rgba(0,0,0,0.10)]'>
				<form>
					<p className='font-medium text-2xl'>Digite los campos</p>
					<p className='text-sm text-[#9CA3AF] py-2'>Los campos con (*) son obligatorios.</p>
					<div className='pt-2'>
						<CustomSelect
							label='Campaign Name:'
							name='campaignName'
							formikValues={formik.values}
							onChangeSelect={value => formik.setFieldValue('campaignName', value)}
							options={OBJECT_CAMPAIGN_NAME}
							messageError={formik.errors.campaignName}
							isRequired
						/>

						<CustomInput
							label='Investigador'
							value={formik.values.investigator}
							name='investigator'
							placeholder='Lorena Paola Cárdenas'
							messageError={formik.errors.investigator}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<TextArea
							label='Remarks'
							value={formik.values.remarks}
							name='remarks'
							placeholder='Descripción u observaciones de la campaña'
							messageError={formik.errors.remarks}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label='Lugar de adquisición:'
							value={formik.values.siteAcquisition}
							name='siteAcquisition'
							placeholder='Salt lake city'
							messageError={formik.errors.siteAcquisition}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label='Sample Point ID:'
							value={formik.values.samplePointId}
							name='samplePointId'
							placeholder='30000'
							messageError={formik.errors.samplePointId}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomInput
							label='Sample Point X:'
							value={formik.values.sampleX}
							name='sampleX'
							placeholder='0.0'
							messageError={formik.errors.sampleX}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<CustomInput
							label='Sample Point Y:'
							value={formik.values.sampleY}
							name='sampleY'
							placeholder='0.0'
							messageError={formik.errors.sampleY}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						{/* <div>
							<CustomInput
								label="Longitud:"
								value={formik.values.longitud}
								name="longitud"
								placeholder="-54.20"
								messageError={formik.errors.longitud}
								isRequired
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<CustomInput
								label="Latitud:"
								value={formik.values.latitud}
								name="latitud"
								placeholder="40.94"
								messageError={formik.errors.latitud}
								isRequired
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div> */}

						<Switch isSelected={isCordenadas} onValueChange={setIsCordenadas} className='mt-2'>
							Tipo de formato de las cordenadas
						</Switch>

						<p className='text-small text-default-500'>
							Cambie el estado del Switch de acuerdo al formato en que quiere digitar las
							cordenadas.
						</p>

						<Divider className='my-4' />
						<p>Cordenadas en formato {isCordenadas ? 'Decimal' : 'Sexagecimal'}</p>

						{isCordenadas ? (
							<>
								<div>
									<CustomInput
										label='Longitud:'
										value={formik.values.longitud}
										name='longitud'
										placeholder='-54.20'
										messageError={formik.errors.longitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									<CustomInput
										label='Latitud:'
										value={formik.values.latitud}
										name='latitud'
										placeholder='40.94'
										messageError={formik.errors.latitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</div>
							</>
						) : (
							<div>
								<p>Longitud: </p>
								<div className='grid gap-3 grid-cols-3'>
									<CustomInput
										label='Grados:'
										value={formik.values.longitud}
										name='longitud'
										placeholder='-54.20'
										messageError={formik.errors.longitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									<CustomInput
										label='Minutos:'
										value={formik.values.latitud}
										name='latitud'
										placeholder='40.94'
										messageError={formik.errors.latitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									<CustomInput
										label='Segundos:'
										value={formik.values.latitud}
										name='latitud'
										placeholder='40.94'
										messageError={formik.errors.latitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</div>
								<p>Latitud: </p>
								<div className='grid gap-3 grid-cols-3'>
									<CustomInput
										label='Grados:'
										value={formik.values.longitud}
										name='longitud'
										placeholder='-54.20'
										messageError={formik.errors.longitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									<CustomInput
										label='Minutos:'
										value={formik.values.latitud}
										name='latitud'
										placeholder='40.94'
										messageError={formik.errors.latitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									<CustomInput
										label='Segundos:'
										value={formik.values.latitud}
										name='latitud'
										placeholder='40.94'
										messageError={formik.errors.latitud}
										isRequired
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</div>
							</div>
						)}
						<Divider className='my-4' />
						<CustomSelect
							label='Angulo de sunpoint:'
							name='anguleSunpoint'
							formikValues={formik.values}
							onChangeSelect={value => formik.setFieldValue('anguleSunpoint', value)}
							options={OBJECT_ANGULE_SUNPOINT}
							messageError={formik.errors.anguleSunpoint}
							isRequired
						/>
						<DatePicker
							label='Fecha de adquisición:'
							value={formik.values.dateAcquisition}
							name='dateAcquisition'
							messageError={formik.errors.dateAcquisition}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomSelect
							label='Método de captura:'
							name='captureMethod'
							formikValues={formik.values}
							onChangeSelect={value => formik.setFieldValue('captureMethod', value)}
							options={OBJECT_METHOD_CAPTURE}
							messageError={formik.errors.captureMethod}
							isRequired
						/>

						<CustomInput
							label='Parámetro de adquisición:'
							value={formik.values.parametersAcquisition}
							name='parametersAcquisition'
							placeholder='256 ms  2 scan integration 1'
							messageError={formik.errors.parametersAcquisition}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<CustomInput
							label='Operador:'
							value={formik.values.operator}
							name='operator'
							placeholder='LPC'
							messageError={formik.errors.operator}
							isRequired
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<CustomSelect
							label='Propietario'
							name='owner'
							formikValues={formik.values}
							onChangeSelect={value => formik.setFieldValue('owner', value)}
							options={OBJECT_OWNERS}
							messageError={formik.errors.owner}
							isRequired
						/>

						<CustomSelect
							label='Angulo Landmark'
							name='anguleLandmark'
							formikValues={formik.values}
							onChangeSelect={value => formik.setFieldValue('anguleLandmark', value)}
							options={OBJECT_ANGULO_LANDMARK}
							messageError={formik.errors.anguleLandmark}
							isRequired
						/>

						<CustomSelect
							label='Estado'
							name='state'
							formikValues={formik.values}
							onChangeSelect={value => formik.setFieldValue('state', value)}
							options={OBJECT_STATE}
							messageError={formik.errors.state}
							isRequired
						/>
					</div>

					<Button
						color='primary'
						onPress={() => sendDataRequest(formik.values)}
						className='flex justify-center mx-auto mt-4'
					>
						Enviar
					</Button>
				</form>
			</div>
			<Toaster />
		</div>
	);
}
