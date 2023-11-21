import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function POST(request: any) {
	try {
		const response = await fetch(
			"https://www.windy.com/es/-Temperatura-temp?temp",
		);
		if (response.status !== 200) {
			throw new Error(
				`Error al obtener la página. Código de estado: ${response.status}`,
			);
		}
		const html = await response.text();
		const dom = new JSDOM(html);
		const windyWeb = dom.window.document;
		const inputWindy = windyWeb.querySelector<HTMLInputElement>("#q") || null;

		if (inputWindy) {
			inputWindy.value = "123";
			const enterEvent = new dom.window.KeyboardEvent("keydown", {
				key: "Enter",
			});
			inputWindy.dispatchEvent(enterEvent);
		}
		return NextResponse.json({ inputWindy }, { status: 200 });
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (err: any) {
		console.log(err);
		return NextResponse.json(err.message, {
			status: 400,
		});
	}
}
