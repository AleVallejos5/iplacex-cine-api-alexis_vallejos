import express, { urlencoded } from 'express';
import cors from 'cors';
import { connectToDatabase } from './src/common/db.js';
import peliculaRoutes from './src/pelicula/routes.js';
import actorRoutes from './src/actor/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
//app.use(urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Ruta por defecto
app.get('/', (req, res) => {
    res.send('Bienvenido al cine Iplacex');
});

// Rutas personalizadas con prefijo /api
app.use('/api', peliculaRoutes);
app.use('/api', actorRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicializar servidor solo si la conexión a la base de datos es exitosa
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log('📚 Endpoints disponibles:');
            console.log('   GET  /api/peliculas');
            console.log('   POST /api/pelicula');
            console.log('   GET  /api/pelicula/:id');
            console.log('   PUT  /api/pelicula/:id');
            console.log('   DELETE /api/pelicula/:id');
            console.log('   GET  /api/actores');
            console.log('   POST /api/actor');
            console.log('   GET  /api/actor/:id');
            console.log('   GET  /api/actor/pelicula/:pelicula');
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();