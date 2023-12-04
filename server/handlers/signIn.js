const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const signIn = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { email, password } = req.body;

    try {
        await client.connect();
        const db = client.db("Bite_Balance"); 
        const user = await db.collection("Data_Users").findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            // Send back the user's _id along with the success message
            res.status(200).json({ message: 'Signed in successfully', userId: user._id, user: user });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
};

module.exports = signIn;
