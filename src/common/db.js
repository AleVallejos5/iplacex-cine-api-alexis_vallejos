import { MongoClient, ServerApiVersion } from 'mongodb';

const connectionString = "mongodb+srv://eva3_express:Charizard5@cluster-express.r78xewn.mongodb.net/?appName=cluster-express";

let client = null;
let db = null;

export const connectToDatabase = async () => {
    try {
        if (!client) {
            client = new MongoClient(connectionString, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true
                }
            });
            
            await client.connect();
            db = client.db('cine-db');
            console.log('✅ Conexión a MongoDB Atlas establecida correctamente');
        }
        return db;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB Atlas:', error);
        throw error;
    }
};

// Función para obtener la colección de películas
export const getPeliculaCollection = async () => {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase first.');
    }
    return db.collection('peliculas');
};

// Función para obtener la colección de actores
export const getActorCollection = async () => {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase first.');
    }
    return db.collection('actores');
};