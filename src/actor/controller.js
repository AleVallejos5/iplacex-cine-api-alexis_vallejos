import { ObjectId } from 'mongodb';
import { getActorCollection, getPeliculaCollection } from '../common/db.js';

export const handleInsertActorRequest = async (req, res) => {
    try {
        const actorCollection = await getActorCollection();
        const peliculaCollection = await getPeliculaCollection();
        
        const { idPelicula, nombre, edad, estaRetirado, premios } = req.body;
        
        if (!idPelicula || !nombre || !edad) {
            return res.status(400).json({ 
                error: 'idPelicula, nombre y edad son requeridos' 
            });
        }

        // Validar que la película exista
        if (!ObjectId.isValid(idPelicula)) {
            return res.status(400).json({ error: 'ID de película mal formado' });
        }

        const pelicula = await peliculaCollection.findOne({ 
            _id: new ObjectId(idPelicula) 
        });
        
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        const nuevoActor = {
            idPelicula,
            nombre,
            edad: parseInt(edad),
            estaRetirado: estaRetirado || false,
            premios: Array.isArray(premios) ? premios : (premios ? [premios] : [])
        };

        const result = await actorCollection.insertOne(nuevoActor);
        
        res.status(201).json({
            _id: result.insertedId,
            ...nuevoActor,
            message: 'Actor creado exitosamente'
        });
    } catch (error) {
        console.error('Error insertando actor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleGetActoresRequest = async (req, res) => {
    try {
        const actorCollection = await getActorCollection();
        const actores = await actorCollection.find({}).toArray();
        res.status(200).json(actores);
    } catch (error) {
        console.error('Error obteniendo actores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleGetActorByIdRequest = async (req, res) => {
    try {
        const actorCollection = await getActorCollection();
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID mal formado' });
        }

        const actor = await actorCollection.findOne({ 
            _id: new ObjectId(id) 
        });
        
        if (!actor) {
            return res.status(404).json({ error: 'Actor no encontrado' });
        }

        res.status(200).json(actor);
    } catch (error) {
        console.error('Error obteniendo actor por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleGetActoresByPeliculaIdRequest = async (req, res) => {
    try {
        const actorCollection = await getActorCollection();
        const { pelicula } = req.params;
        
        if (!ObjectId.isValid(pelicula)) {
            return res.status(400).json({ error: 'ID de película mal formado' });
        }

        const actores = await actorCollection.find({ 
            idPelicula: pelicula 
        }).toArray();
        
        res.status(200).json(actores);
    } catch (error) {
        console.error('Error obteniendo actores por película:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};