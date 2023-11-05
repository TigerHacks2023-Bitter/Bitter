const { MongoClient, ObjectId } = require('mongodb');

const mongoURI = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.getUserLikedComments = async (req, res) => {
  try {
    // Get UserId
    const body = req.body;
    const userId = body.userId;
    const userObjectId = new ObjectId(userId);

    // Connect to the database
    const client = new MongoClient(mongoURI, { useNewUrlParser: true });
    await client.connect();
    const db = client.db('Bitterr-Test');

    // Get the Users and Bits collections
    const usersCollection = db.collection('users');
    const commentsCollection = db.collection('comments'); 

    // Find liked posts in user object
    const userObject = await usersCollection.findOne({_id: userObjectId});
    const likedPostIds = userObject.likedComments;

    // Retrieve the liked posts
    const likedPosts = await commentsCollection.find({ _id: { $in: likedPostIds } }).toArray();

    client.close();

    // Return the liked posts
    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).send('Error retrieving liked bits: ' + error.message);
  }
};
