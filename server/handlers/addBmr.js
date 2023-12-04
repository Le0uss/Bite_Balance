const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const addBMR = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { _id, BMR } = req.body;

    if (!_id || !BMR ) {
        return res.status(400).send('Missing required fields: _id and BMR');
    }

    // const currentDate = new Date().toISOString().split('T')[0]; // Gets current date in YYYY-MM-DD format

    try {
        await client.connect();
        const db = client.db('Bite_Balance');
        const collection = db.collection('Data_Users');

        const user = await collection.findOne({ _id: new ObjectId(_id) });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const updateDocument = {
            $set: { BMR: BMR },
        };


        await collection.updateOne({ _id: new ObjectId(_id) }, updateDocument);

        res.status(200).send('BMR added successfully');
    } catch (error) {
        console.error("Error in addBMR: ", error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
};

module.exports = addBMR;
