import {execSync} from 'child_process';
import fs from 'fs/promises';
import {NextResponse} from 'next/server';
import * as path from 'path';

export async function POST(request: Request) {
	const {longitud, latitud} = await request.json();
	if (!longitud || !latitud) {
		return NextResponse.json(
			{error: 'Por favor proporcione parametros de busqueda'},
			{status: 400}
		);
	}
	console.log('ejecucion de script');
	const scriptDir = path.resolve(process.cwd(), 'src/app/api/scripts');
	const scriptPath = path.join(scriptDir, 'etl.py');

	try {
		const resultadoBuffer = execSync(`python ${scriptPath} ${longitud} ${latitud}`);
		const resultadoJSON = resultadoBuffer.toString('utf-8').replace(/'/g, '"');
		console.log('Contenido JSON:', resultadoJSON);
		const resultado = JSON.parse(resultadoJSON);
		console.log('RESULTADO', resultado);
		return NextResponse.json({success: true, resultado: resultado}, {status: 200});
	} catch (error: any) {
		const errorMessage = error.message || 'Error en el servidor';
		console.error('Error en la función POST:', error);
		return NextResponse.json({error: errorMessage}, {status: 500});
	}
}
