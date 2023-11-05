const { ObjectId, MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.createBit = async (req, res) => {
    try {
        // Get userId and message
        const body = req.body;
        const userId = body.userId;
        const message = body.message;

        // Verify userID and message exist
        if (!userId || !message) {
            console.log('Missing a parameter in body:');
            console.log(body);
            res.status(500).send('Missing parameter in body.');
        }

        // Create a new MongoClient
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Connect to the MongoDB instance
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('Bitterr-Test');
        const bitsCollection = database.collection('bits');
        const usersCollection = database.collection('users');

        // Get User ObjectId
        const userObjectId = new ObjectId(userId);

        // Create an object to add to the collection
        const objectToAdd = { 
            userId: userObjectId,
            message: message,
            likes: 0,
            dislikes: 0,
            comments: []
        };

        // Insert the object into the collection
        const newBit = await bitsCollection.insertOne(objectToAdd);
        const newBitId = newBit.insertedId;

        // Add the bit ID to the user's bits
        const result = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $push: { bits: newBitId } }
        );

        // Close the connection
        await client.close();

        // Respond with success message
        res.status(200).send('Object added to MongoDB');
    } catch (err) {
        // Handle any errors
        console.error('Error occurred:', err);
        res.status(500).send('Error adding object to MongoDB');
    }
};

