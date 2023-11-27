import { execSync } from "child_process";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import * as path from "path";

export async function POST(request: Request) {
	const { longitud, latitud } = await request.json();
	if (!longitud || !latitud) {
		return NextResponse.json("Por favor proporcione una búsqueda");
	}

	// Obtener la ruta del directorio del script de Node.js
	const scriptDir = path.resolve(process.cwd(), "src/app/api/scripts");

	// Construir la ruta al script de Python usando una ruta relativa
	const scriptPath = path.join(scriptDir, "etl.py");

	try {
		execSync(`python ${scriptPath} ${longitud} ${latitud}`);

		const resultadosPath = path.resolve(
			process.cwd(),
			"public/results/datos.json",
		);
		const resultadosJSON = await fs.readFile(resultadosPath, "utf-8");
		const resultados = JSON.parse(resultadosJSON);

		return NextResponse.json({ success: true, resultados }, { status: 200 });
	} catch (error) {
		console.error("Error en la función POST:", error);
		return NextResponse.json({ error: "Hubo un error" }, { status: 500 });
	}
}
