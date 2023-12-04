const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const saltRounds = 10; // Adjust the number of salt rounds as necessary

const signUp = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { email, password } = req.body;

    try {
        await client.connect();
        const db = client.db("Bite_Balance"); // Replace with your database name
        const existingUser = await db.collection("Data_Users").findOne({ email });

        if (existingUser) {
            res.status(409).send('User already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { email, password: hashedPassword, calorieIntake: [], BMR: null };

        const result = await db.collection("Data_Users").insertOne(newUser);

        // Send back the new user's _id along with the success message
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId, user: newUser });
    } catch (error) {
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
};

module.exports = signUp;
