"use client";
import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import { useEffect } from "react";
import imageFacsat from "../../public/images/facsat.png";
import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {}, []);
	return (
		// rome-ignore lint/a11y/useValidLang: <explanation>
		<html lang="Es">
			<body>
				<Navbar isBordered className="bg-[#1C4259]">
					<NavbarBrand>
						<h1 className="text-4xl font-bold">FACSAT-2</h1>
					</NavbarBrand>
					<NavbarContent className="hidden sm:flex gap-4" justify="center">
						<NavbarItem>
							<Link href="/api/data" target="_blank" className="text-white">
								API
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link href="/" className="text-white">
								Formulario
							</Link>
						</NavbarItem>
					</NavbarContent>
					<NavbarContent justify="end">
						<NavbarItem>
							<Button as={Link} color="default" href="/datas/records">
								Registros
							</Button>
						</NavbarItem>
					</NavbarContent>
				</Navbar>
				<Providers>
					<main className="relative bg-[#fff]">
						<div className="relative z-20">{children}</div>
						<div className="absolute top-0 left-0 w-full h-full bg-[rgba(28, 66, 89, 0.4)] z-10" />
						<Image
							className="absolute top-0 left-0 w-screen h-screen object-cover z-0"
							alt="FACSAT"
							src={imageFacsat}
							fill={true}
						/>
					</main>
				</Providers>
			</body>
		</html>
	);
}
