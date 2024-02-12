import mongoose from 'mongoose';

const conn = {
	isConnected: false,
};

export async function connectDB() {
	if (conn.isConnected) return;
	try {
		await mongoose.connect(
			`mongodb://${process.env.NEXT_PUBLIC_USER_DB}:${process.env.NEXT_PUBLIC_PASS_DB}@db:27017/facsat?useNewUrlParser=true&authSource=admin`
		);
		console.log('Conexión exitosa a la base de datos.');
		conn.isConnected = mongoose.connection.readyState === 1;
	} catch (error) {
		console.error('Error al conectar a la base de datos:', error);
	}
}

mongoose.connection.on('connected', () => {
	console.log('Mongoose is connected');
});

mongoose.connection.on('error', (err: any) => {
	console.log('Mongoose connection Error', err);
});
