import Data from "@/app/models/Data";
import { connectDB } from "@/app/utils/db/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
	connectDB();
	const datas = await Data.find();
	return NextResponse.json(datas);
}

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function POST(request: any) {
	try {
		const data = await request.json();
		console.log("Data recibida:", data);

		const newData = new Data(data);
		console.log("Objeto Data creado:", newData);

		const savedData = await newData.save();
		console.log("Datos guardados exitosamente:", savedData);

		return NextResponse.json(savedData);
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error("Error al procesar la solicitud:", error);
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
