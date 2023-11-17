"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import exportToExcel from "../../utils/export/excelExporter";

import { IForm } from "../../interfaces/form";

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

export default function FormPage() {
	const [array, setArray] = useState<IForm[]>([]);
	const [selectionBehavior, setSelectionBehavior] = React.useState("replace");

	const getData = async () => {
		try {
			const res = await fetch("/api/data", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				throw new Error(`Request failed with status: ${res.status}`);
			}

			const data = await res.json();
			setArray(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const [exported, setExported] = useState(false);

	const dataToExport = [...array];

	const outputPath = "./facsat/datos.xlsx";

	const handleExportClick = () => {
		exportToExcel(dataToExport, outputPath);
		setExported(true);
	};

	return (
		<main className="flex min-h-screen items-center mx-auto flex-col gap-8 py-8 dark text-foreground container ">
			<Table>
				<TableHeader>
					<TableColumn>Sample Point ID</TableColumn>
					<TableColumn>Survey ID</TableColumn>
					<TableColumn>Lugar de Adquisición</TableColumn>
					<TableColumn>Longitud</TableColumn>
					<TableColumn>Latitud</TableColumn>
					<TableColumn>Fecha de adquisición</TableColumn>
					<TableColumn>Operador</TableColumn>
				</TableHeader>
				<TableBody items={array.reverse()}>
					{(item) => (
						<TableRow key={item._id}>
							{(columnKey) => (
								<TableCell>{getKeyValue(item, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
					{/* {array.reverse().map((item) => (
						<TableRow key={item._id}>
							<TableCell>
								{typeof window !== "undefined" ? item.samplePointId : ""}{" "}
							</TableCell>
							<TableCell>
								{typeof window !== "undefined" ? item.surveyId : ""}
							</TableCell>
							<TableCell>
								{typeof window !== "undefined" ? item.siteAcquisition : ""}
							</TableCell>
							<TableCell>
								{typeof window !== "undefined" ? item.longitud : ""}
							</TableCell>
							<TableCell>
								{typeof window !== "undefined" ? item.latitud : ""}
							</TableCell>
							<TableCell>
								{typeof window !== "undefined" ? item.dateAcquisition : ""}
							</TableCell>
							<TableCell>
								{typeof window !== "undefined" ? item.operator : ""}
							</TableCell>
						</TableRow>
					))} */}
				</TableBody>
			</Table>
			<div>
				{/* rome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={handleExportClick} disabled={exported}>
					exportar a excel
				</button>
			</div>
		</main>
	);
}
