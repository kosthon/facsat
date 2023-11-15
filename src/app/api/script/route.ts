import Data from "@/app/models/Data";
import { NextResponse } from "next/server";

export async function POST(
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	req: any,
) {
	try {
		const data = await req.json();
		const newData = new Data(data);
		const savedData = await newData.save();
		console.log(data);

		const { spawn } = require("child_process");
		const pythonProcess = spawn("python", [
			"app/scripts/etl.py",
			JSON.stringify(data),
		]);

		let scriptOutput = "";

		pythonProcess.stdout.on("data", (data: Buffer) => {
			scriptOutput += data.toString();
		});

		pythonProcess.on("close", (code: number) => {
			if (code === 0) {
				NextResponse.json("Script ejecutado exitosamente", savedData);
			} else {
				NextResponse.json("Ocurrió un error al ejecutar el script", {
					status: 500,
				});
			}
		});
	} catch (error) {
		console.error("Error al ejecutar el script:", error);
		NextResponse.json("Ocurrió un error al ejecutar el script", {
			status: 500,
		});
	}
}
