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

export default function FormPage() {
	const [array, setArray] = useState<string[]>([]);
	const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");

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
				<TableBody>
					{array.reverse().map((item) => (
						<TableRow key={String(item._id)}>
							<TableCell>{item.samplePointId}</TableCell>
							<TableCell>{item.surveyId}</TableCell>
							<TableCell>{item.siteAcquisition}</TableCell>
							<TableCell>{item.longitud}</TableCell>
							<TableCell>{item.latitud}</TableCell>
							<TableCell>{item.dateAcquisition}</TableCell>
							<TableCell>{item.operator}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
}
