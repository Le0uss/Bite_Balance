const { MongoClient } = require('mongodb');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const deleteFood = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { food_id, date } = req.body;
    if (!food_id || !date) {
        return res.status(400).send('Missing required fields: food_id and date');
    }

    try {
        await client.connect();
        const db = client.db('Bite_Balance');
        const collection = db.collection('Data_Users');

        // Delete the food item with the specified food_id and date from MongoDB
        const result = await collection.deleteOne({ food_id, date: new Date(date) });

        if (result.deletedCount === 0) {
            return res.status(404).send('No matching food item found');
        }

        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).send('An error occurred while deleting the food item.');
    } finally {
        await client.close();
    }
};

module.exports = deleteFood;
