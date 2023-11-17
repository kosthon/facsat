export interface IForm {
	_id?: number;

	investigator: string;
	remarks: string;
	anguleLandmark: string;
	state: string;
	sampleX: string;
	sampleY: string;
	campaignName: string;

	siteAcquisition: string;
	samplePointId: string;
	surveyId: number;
	longitud: string;
	latitud: string;
	anguleSunpoint: string;
	dateAcquisition: string;
	captureMethod: string;
	parametersAcquisition: string;
	operator: string;
	owner: string;
}
