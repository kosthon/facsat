import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
	const { longitud, latitud } = await request.json();
	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
	if (!longitud || !latitud) {
		return NextResponse.json("Por favor proporcione una busqueda");
	}
	let browser;

	try {
		browser = await puppeteer.launch({ headless: "new" });
		const page = await browser.newPage();
		await page.goto("https://www.windy.com/es/-Temperatura-temp?temp", {
			timeout: 60000,
		});
		await page.waitForSelector("#q", { timeout: 30000 });
		await page.type("#q", `${longitud}, ${latitud}`);
		await page.keyboard.press("Enter");
		await sleep(15000);
		await page.keyboard.press("Enter");
		await sleep(15000);
		console.log("DESPUES DE SEGUNDO ENTER");

		console.log("ANTES DE .leaflet-marker-icon");
		const elemento = await page.$(
			".leaflet-marker-icon.icon-dot.leaflet-zoom-animated.leaflet-interactive",
		);
		await page.evaluate(() => {
			const marker = document.querySelector(".leaflet-marker-icon");
			if (marker) {
				console.log("encontrado");
			}
		});
		// await page.waitForSelector(
		// 	".leaflet-marker-icon.icon-dot.leaflet-zoom-animated.leaflet-interactive",
		// 	{
		// 		timeout: 35000,
		// 	},
		// );
		// console.log("DESPUES DE .leaflet-marker-icon");
		// console.log("ANTES DE Click .leaflet-marker-icon");
		// await page.click(".leaflet-marker-icon", { button: "right" });
		// console.log("DESPUES DE Click .leaflet-marker-icon");
		// await sleep(15000);

		// await page.click('a[data-t="SHOW_PICKER"]', { button: "left" });
		// await sleep(15000);

		// const temperatura = await page.$eval(
		// 	'big[data-do="changeMetric"]',
		// 	(elemento) => {
		// 		const textoBig = elemento.textContent?.trim();
		// 		const textoSpan = elemento.querySelector("span")?.textContent?.trim();
		// 		return `${textoBig} ${textoSpan}`;
		// 	},
		// );

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error en la función POST:", error);
		return NextResponse.json({ error: "Hubo un error" }, { status: 500 });
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
