import { ObjectId } from 'mongodb';
import { getPeliculaCollection, getActorCollection } from '../common/db.js';

export const handleInsertPeliculaRequest = async (req, res) => {
    try {
        const peliculaCollection = await getPeliculaCollection();
        const { nombre, generos, anioEstreno } = req.body;
        
        if (!nombre || !generos || !anioEstreno) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos: nombre, generos, anioEstreno' 
            });
        }

        const nuevaPelicula = {
            nombre,
            generos: Array.isArray(generos) ? generos : [generos],
            anioEstreno: parseInt(anioEstreno)
        };

        const result = await peliculaCollection.insertOne(nuevaPelicula);
        
        res.status(201).json({
            _id: result.insertedId,
            ...nuevaPelicula,
            message: 'Película creada exitosamente'
        });
    } catch (error) {
        console.error('Error insertando película:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleGetPeliculasRequest = async (req, res) => {
    try {
        const peliculaCollection = await getPeliculaCollection();
        const peliculas = await peliculaCollection.find({}).toArray();
        res.status(200).json(peliculas);
    } catch (error) {
        console.error('Error obteniendo películas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleGetPeliculaByIdRequest = async (req, res) => {
    try {
        const peliculaCollection = await getPeliculaCollection();
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID mal formado' });
        }

        const pelicula = await peliculaCollection.findOne({ 
            _id: new ObjectId(id) 
        });
        
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.status(200).json(pelicula);
    } catch (error) {
        console.error('Error obteniendo película por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleUpdatePeliculaByIdRequest = async (req, res) => {
    try {
        const peliculaCollection = await getPeliculaCollection();
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID mal formado' });
        }

        const { nombre, generos, anioEstreno } = req.body;
        const updateData = {};

        if (nombre) updateData.nombre = nombre;
        if (generos) updateData.generos = Array.isArray(generos) ? generos : [generos];
        if (anioEstreno) updateData.anioEstreno = parseInt(anioEstreno);

        const result = await peliculaCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.status(200).json({ 
            message: 'Película actualizada correctamente',
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        console.error('Error actualizando película:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const handleDeletePeliculaByIdRequest = async (req, res) => {
    try {
        const peliculaCollection = await getPeliculaCollection();
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID mal formado' });
        }

        const result = await peliculaCollection.deleteOne({ 
            _id: new ObjectId(id) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.status(200).json({ 
            message: 'Película eliminada correctamente',
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        console.error('Error eliminando película:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};