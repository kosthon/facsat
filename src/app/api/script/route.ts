import { execSync } from "child_process";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import * as path from "path";

export async function POST(request: Request) {
	const { longitud, latitud } = await request.json();
	if (!longitud || !latitud) {
		return NextResponse.json(
			{ error: "Por favor proporcione parametros de busqueda" },
			{ status: 400 },
		);
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

		const ultimoResultado = resultados[resultados.length - 1];
		
		return NextResponse.json(
			{ success: true, ultimoResultado },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error en la función POST:", error);
		return NextResponse.json({ error: "Hubo un error" }, { status: 500 });
	}
}
