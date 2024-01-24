import { connect, connection } from "mongoose";

const conn = {
	isConnected: false,
};

export async function connectDB() {
	if (conn.isConnected) return;
	try {
		await connect("mongodb://usuario:contraseña@facsat-db:27017/facsat");
		console.log("Conexión exitosa a la base de datos.");
		conn.isConnected = connection.readyState === 1;
	} catch (error) {
		console.error("Error al conectar a la base de datos:", error);
	}
}

connection.on("connected", () => {
	console.log("Moongose is connected");
});

connection.on("error", (err) => {
	console.log("Moongose connection Error", err);
});
