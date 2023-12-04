const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;


const getUserData = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const userId = req.params.userId;

    try {
        await client.connect();
        const db = client.db("Bite_Balance");
        // Using ObjectId to search by _id in MongoDB
        const userData = await db.collection("Data_Users").findOne({ _id: new ObjectId(userId) });

        if (!userData) {
            res.status(404).send('User not found');
            return;
        }
        
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
};

module.exports = getUserData;
