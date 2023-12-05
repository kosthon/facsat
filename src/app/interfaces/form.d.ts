export interface IForm {
	_id?: number;
	isCordenadas: boolean;
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

	// WEB SCRAPING
	temperature?: string;
	pressure?: string;
	localTime?: string;
	julianTime?: string;
	utcTime?: string;
	altitude?: string;
	elevation?: string;
	TLE?: ITLE;
}

export interface ITLE {
	Norad_Id: string;
	International_Classification: string;
	International_Designation: string;
	Epoch_Time: string;
	First_Derivative_Mean_Motion: string;
	Second_Derivative_Mean_Motion: string;
	Inclination: string;
	Right_Ascension_of_the_Ascending_Node: string;
	Eccentricity: string;
	Argument_of_Perigee: string;
	Mean_Anomaly: string;
	Mean_Motion: string;
	Revolution_Number_at_Epoch: string;
}
