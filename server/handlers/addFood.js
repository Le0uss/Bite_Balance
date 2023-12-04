const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const addCalorieIntake = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { _id, calories, date } = req.body;

    if (!_id || !calories || !date) {
        return res.status(400).send('Missing required fields: _id and calories');
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

        // Update logic to add calories and current date
        const update = {
            $push: { calorieIntake: { date: date, calories: calories } }
        };

        await collection.updateOne({ _id: new ObjectId(_id) }, update);

        res.status(200).send('Calorie intake updated successfully');
    } catch (error) {
        console.error("Error in addCalorieIntake: ", error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
};

module.exports = addCalorieIntake;
