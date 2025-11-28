import express from 'express';
import {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
} from './controller.js';

const actorRoutes = express.Router();

actorRoutes.post('/actor', handleInsertActorRequest);
actorRoutes.get('/actores', handleGetActoresRequest);
actorRoutes.get('/actor/:id', handleGetActorByIdRequest);
actorRoutes.get('/actor/pelicula/:pelicula', handleGetActoresByPeliculaIdRequest);

export default actorRoutes;