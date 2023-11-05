const { ObjectId, MongoClient } = require('mongodb');

// Connection URI 
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.likeComment = async (req, res) => {
    try {
        // Get user Object id and bit object id
        const body = req.body;
        const userId = body.userId;
        const commentId = body.commentId;

        // Exit if no ID or bit ID
        if (!userId || !commentId) {
            console.log('Missing ID in body:');
            console.log(body);
            res.status(500).send('Missing ID in body.');
            return;
        }

        // Get Object Ids
        const userObjectId = new ObjectId(userId);
        const commentObjectId = new ObjectId(commentId);

        // Create a new MongoClient and connect to db
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db('Bitterr-Test');

        // Get Bits and user collections
        const commentsCollection = database.collection('comments');
        const usersCollection = database.collection('users');

        // User already likes
        const userLike = await usersCollection.findOne({_id: userObjectId, likedComments: {$in: [commentObjectId]}})

        if (userLike) {
            res.status(500).send('User already likes this.');
            return;
        }
        
        // If user has disliked, remove dilike
        const userDislike = await usersCollection.findOne({_id: userObjectId, dislikedComments: {$in: [commentObjectId]}})
        
        if (userDislike) {
            const unDislikeResult = await commentsCollection.updateOne({_id: commentObjectId}, {$inc: {dislikes: -1}});
            const removeDislikeResult = await usersCollection.updateOne({_id: userObjectId}, {$pull: {dislikedComments: {$in: [commentObjectId]}}})
        }

        // Add Like
        const newLike = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $push: { likedComments: commentObjectId } }
        );
        const likeResult = await commentsCollection.updateOne({_id: commentObjectId}, {$inc: {likes: 1}});

        // Close and return success
        client.close();
        res.status(200).send('Likes added to the message in MongoDB');
    } catch (err) {
        // Handle any errors
        console.error('Error occurred:', err);
        res.status(500).send('Error adding likes to the message in MongoDB');
    }
};

