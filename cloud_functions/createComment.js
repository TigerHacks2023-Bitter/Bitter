const { ObjectId, MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.createComment = async (req, res) => {
    try {
        // Get userId and message
        const body = req.body;
        const parentBitId = body.parentBitId;
        const userId = body.userId;
        const message = body.message;

        // Verify userID and message exist
        if (!userId || !message || !parentBitId) {
            console.log('Missing a parameter in body:');
            console.log(body);
            res.status(500).send('Missing parameter in body.');
        }

        // Create a new MongoClient and connect
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db('Bitterr-Test');

        // Grab the collections
        const bitsCollection = database.collection('bits');
        const usersCollection = database.collection('users');
        const commentsCollection = database.collection('comments');

        // Get objectIds
        const userObjectId = new ObjectId(userId);
        const parentBitObjectId = new ObjectId(parentBitId);

        const objectToAdd = { 
            userId: userObjectId,
            parentBitId: parentBitObjectId,
            message: message,
            likes: 0,
            dislikes: 0,
        };

        // Insert the Comment
        const newComment = await commentsCollection.insertOne(objectToAdd);
        const commentObjectId = newComment.insertedId;

        // Add the comment ID to the user's comments
        const result = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $push: { comments: commentObjectId } }
        );

        // Add the comment ID to the bit's comments
        const bitCommentsResult = await bitsCollection.findOneAndUpdate(
            { _id: parentBitObjectId },
            { $push: { comments: commentObjectId } }
        );

        // Close the connection
        await client.close();
        res.status(200).send('Comment added to MongoDB');
    } catch (err) {
        // Handle any errors
        console.error('Error occurred:', err);
        res.status(500).send('Error adding object to MongoDB');
    }
};