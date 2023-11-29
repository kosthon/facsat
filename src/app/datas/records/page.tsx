"use client";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InsertPageBreakRoundedIcon from "@mui/icons-material/InsertPageBreakRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import {
	Button,
	Chip,
	ChipProps,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	User,
	useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import exportToExcel from "../../utils/export/excelExporter";

import { toast } from "sonner";
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

const statusColor: Record<string, ChipProps["color"]> = {
	Crudo: "warning",
	Procesado: "success",
};

export default function FormPage() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [backdrop, setBackdrop] = React.useState<
		"opaque" | "blur" | "transparent"
	>("blur");

	const [selectedItem, setSelectedItem] = useState<IForm | null>(null);

	const handleOpen = (
		selectedBackdrop: "opaque" | "blur" | "transparent",
		item: IForm,
	) => {
		setBackdrop(selectedBackdrop);
		setSelectedItem(item);
		onOpen();
	};

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

	const handleDeleteItem = async (itemId: string) => {
		try {
			const response = await fetch(`/api/data/${itemId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			getData(); // Asegúrate de definir la función getData para actualizar la lista
			toast.success("Registro eliminado correctamente");
		} catch (error) {
			console.error("Error al eliminar el registro:", error);
			toast.error("Error al eliminar el registro");
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
			<Modal
				backdrop={backdrop}
				isOpen={isOpen}
				onClose={() => {
					onClose();
					setSelectedItem(null);
				}}
				size="2xl"
				classNames={{
					body: "py-6",
					backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
					base: "border-[#292f46] bg-[#18181b] dark:bg-[#19172c] text-[#a8b0d3]",
					header: "border-b-[1px] border-[#292f46]",
					footer: "border-t-[1px] border-[#292f46]",
					closeButton: "hover:bg-white/5 active:bg-white/10",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{selectedItem?.siteAcquisition}. ({selectedItem?.longitud},{" "}
								{selectedItem?.latitud})
							</ModalHeader>
							<ModalBody>
								{selectedItem && (
									<>
										<small>Investigador</small>
										<p>{selectedItem.investigator}</p>
										<p>Sample Point ID: {selectedItem.samplePointId}</p>
										<p>Survey ID: {selectedItem.surveyId}</p>
										<p>Operador: {selectedItem.operator}</p>
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									size="sm"
									color="secondary"
									variant="ghost"
									onPress={() => {
										onClose();
										setSelectedItem(null);
									}}
									className="mx-auto"
								>
									Cerrar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<Table
				selectionBehavior={selectionBehavior}
				// onRowAction={(key) => {
				// 	const selectedItem = array.find((item) => item._id === key);
				// 	if (selectedItem) {
				// 		handleOpen("blur", selectedItem); // Puedes ajustar el tipo de fondo según tus necesidades
				// 	}
				// }}
			>
				<TableHeader>
					<TableColumn>Investigador</TableColumn>
					<TableColumn>Lugar de Adquisición</TableColumn>
					<TableColumn>Sample Point ID</TableColumn>
					<TableColumn>Survey ID</TableColumn>
					<TableColumn>Fecha de adquisición</TableColumn>
					<TableColumn>Estado</TableColumn>
					<TableColumn>Acciones</TableColumn>
				</TableHeader>
				<TableBody
					items={array.slice().reverse()}
					emptyContent={"No hay data por mostrar."}
				>
					{(item) => (
						<TableRow key={item._id} className="cursor-auto">
							<TableCell>
								<User
									name={item.investigator}
									description={item.owner}
									avatarProps={{
										name: `${item.investigator}`,
									}}
								/>
							</TableCell>
							<TableCell>
								<p className="font-medium">{item.siteAcquisition}</p>
								<p className="font-thin text-xs">
									({item.longitud}, {item.latitud})
								</p>
							</TableCell>
							<TableCell>{item.samplePointId}</TableCell>
							<TableCell>{item.surveyId}</TableCell>
							<TableCell>{item.dateAcquisition}</TableCell>
							<TableCell>
								<Chip
									size="sm"
									variant="flat"
									color={statusColor[item.state] || "default"}
								>
									{item.state}
								</Chip>
							</TableCell>
							<TableCell>
								<div className="relative flex items-center gap-2">
									<Tooltip color="primary" content="Detalles">
										{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
										<span
											onClick={() => handleOpen("blur", item)}
											className="text-lg text-default-400 cursor-pointer active:opacity-50"
										>
											<RemoveRedEyeRoundedIcon />
										</span>
									</Tooltip>
									<Tooltip color="danger" content="Eliminar registro">
										{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
										<span
											className="text-lg text-danger cursor-pointer active:opacity-50"
											onClick={() => handleDeleteItem(item?._id || "")}
											// Utiliza item?._id para acceder a item._id solo si item no es undefined
										>
											<DeleteOutlineRoundedIcon />
										</span>
									</Tooltip>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div>
				<Button
					onClick={handleExportClick}
					color="success"
					startContent={<InsertPageBreakRoundedIcon />}
					variant="flat"
				>
					Exportar a Excel
				</Button>
			</div>
		</main>
	);
}
