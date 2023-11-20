"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
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
	const [selectionBehavior, setSelectionBehavior] = React.useState<
		"toggle" | "replace" | undefined
	>("toggle");

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

	const outputPath = "./facsat/datos.xlsx";

	const handleExportClick = () => {
		exportToExcel(array, outputPath);
		setExported(true);
	};

	return (
		<main className="flex min-h-screen items-center mx-auto flex-col gap-8 py-8 dark text-foreground container ">
			<Table
				selectionBehavior={selectionBehavior}
				onRowAction={(key) => {
					const selectedItem = array.find((item) => item._id === key);
					if (selectedItem) {
						alert(
							`Opening item - Sample Point ID: ${selectedItem.samplePointId}, Survey ID: ${selectedItem.surveyId}, Operador: ${selectedItem.operator}`,
						);
					}
				}}
			>
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
							<TableCell>{item.samplePointId}</TableCell>
							<TableCell>{item.surveyId}</TableCell>
							<TableCell>{item.siteAcquisition}</TableCell>
							<TableCell>{item.longitud}</TableCell>
							<TableCell>{item.latitud}</TableCell>
							<TableCell>{item.dateAcquisition}</TableCell>
							<TableCell>{item.operator}</TableCell>
						</TableRow>
					)}
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
