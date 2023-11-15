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
		const newData = new Data(data);
		const savedData = await newData.save();
		return NextResponse.json(savedData);
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		return NextResponse.json(error.message, {
			status: 400,
		});
	}
}