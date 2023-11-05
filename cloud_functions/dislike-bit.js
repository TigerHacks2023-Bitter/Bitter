const { ObjectId, MongoClient } = require('mongodb');

// Connection URI 
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.dislikeBit = async (req, res) => {
    try {
        // Get user Object id and bit object id
        const body = req.body;
        const userId = body.userId;
        const bitId = body.bitId;

        // Exit if no ID or bit ID
        if (!userId || !bitId) {
            console.log('Missing ID in body:');
            console.log(body);
            res.status(500).send('Missing ID in body.');
            return;
        }

        // Get Object Ids
        const userObjectId = new ObjectId(userId);
        const bitObjectId = new ObjectId(bitId);

        // Create a new MongoClient and connect to db
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db('Bitterr-Test');

        // Get Bits and user collections
        const bitsCollection = database.collection('bits');
        const usersCollection = database.collection('users');

        // User already dislikes
        const userdislike = await usersCollection.findOne({_id: userObjectId, dislikes: {$in: [bitObjectId]}})

        if (userdislike) {
            res.status(500).send('User already dislikes this.');
            return;
        }
        
        // If user has liked, remove like
        const userLike = await usersCollection.findOne({_id: userObjectId, likes: {$in: [bitObjectId]}})
        
        if (userLike) {
            const unLikeResult = await bitsCollection.updateOne({_id: bitObjectId}, {$inc: {likes: -1}});
            const removeLikeResult = await usersCollection.updateOne({_id: userObjectId}, {$pull: {likes: {$in: [bitObjectId]}}})
        }

        // Add Disike
        const newDislike = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $push: { dislikes: bitObjectId } }
        );
        const dislikeResult = await bitsCollection.updateOne({_id: bitObjectId}, {$inc: {dislikes: 1}});

        // Close and return success
        client.close();
        res.status(200).send('Dislikes added to the message in MongoDB');
    } catch (err) {
        // Handle any errors
        console.error('Error occurred:', err);
        res.status(500).send('Error adding dislikes to the message in MongoDB');
    }
};

