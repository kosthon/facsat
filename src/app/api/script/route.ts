import { execSync } from "child_process";
import { NextResponse } from "next/server";
import * as path from "path";

export async function POST(request: Request) {
	const { longitud, latitud } = await request.json();
	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

	if (!longitud || !latitud) {
		return NextResponse.json("Por favor proporcione una búsqueda");
	}

	// Obtener la ruta del directorio del script de Node.js
	const scriptDir = path.resolve(process.cwd(), "src/app/api/scripts");

	// Construir la ruta al script de Python usando una ruta relativa
	const scriptPath = path.join(scriptDir, "etl.py");

	try {
		execSync(`python ${scriptPath} ${longitud} ${latitud}`);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error en la función POST:", error);
		return NextResponse.json({ error: "Hubo un error" }, { status: 500 });
	}
}
