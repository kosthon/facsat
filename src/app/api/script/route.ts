import { execSync } from "child_process";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
	const { longitud, latitud } = await request.json();
	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

	if (!longitud || !latitud) {
		return NextResponse.json("Por favor proporcione una búsqueda");
	}

	// Ajusta la ruta relativa según tu estructura de carpetas
	const scriptPath = path.join(__dirname, "..", "api", "scripts", "etl.py");
	const normalizedScriptPath = scriptPath.replace(/\\/g, "/"); // Asegura compatibilidad con todos los sistemas

	try {
		execSync(`python ${normalizedScriptPath} ${longitud} ${latitud}`);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error en la función POST:", error);
		return NextResponse.json({ error: "Hubo un error" }, { status: 500 });
	}
}
