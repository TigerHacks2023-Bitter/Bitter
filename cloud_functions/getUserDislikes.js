const { MongoClient, ObjectId } = require('mongodb');

const mongoURI = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.getUserDislikes = async (req, res) => {
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
    const bitsCollection = db.collection('bits'); 

    // Find liked posts in user object
    const userObject = await usersCollection.findOne({_id: userObjectId});
    const dislikedPostIds = userObject.dislikes;

    // Retrieve the liked posts
    const dislikedPosts = await bitsCollection.find({ _id: { $in: dislikedPostIds } }).toArray();

    console.log(dislikedPosts);
    console.log(userObject);

    client.close();

    // Return the liked posts
    res.status(200).json(dislikedPosts);
  } catch (error) {
    res.status(500).send('Error retrieving disliked bits: ' + error.message);
  }
};
