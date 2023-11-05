const { ObjectId, MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.deleteBit = async (req, res) => {
  try {
    // Get userId and message
    const body = req.body;
    const userId = body.userId;
    const bitId = body.bitId;

    // Verify userID and message exist
    if (!userId || !bitId) {
      console.log('Missing a parameter in body:');
      console.log(body);
      return res.status(500).send('Missing parameter in body.');
    }

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    const database = client.db('Bitterr-Test');

    // Bits Collection
    const bitsCollection = database.collection('bits');
    const usersCollection = database.collection('users');
    const commentsCollection = database.collection('comments');

    // Create Object Ids
    const bitObjectId = new ObjectId(bitId);
    const userObjectId = new ObjectId(userId);
    
    // If the user is the owner of the post, delete it
    const isUserPost = usersCollection.findOne({_id: userObjectId, bits: {$in: [bitObjectId]}});
    if (isUserPost) {
      // Get Comments
      const bitObject = await bitsCollection.findOne({_id: bitObjectId});
      const commentObjectIds = bitObject.comments.map(id => new ObjectId(id));

      // Remove objects
      const bitRemove = await bitsCollection.deleteOne({_id: bitObjectId});
      const userRemove = await usersCollection.updateOne({_id: userObjectId}, {$pull: {bits: {$in: [bitObjectId]}}});
      const commentsRemove = await commentsCollection.deleteMany({_id: {$in: commentObjectIds}});
      const commentsFromUser = await usersCollection.update({comments: {$in: commentObjectIds}}, {$pull: {comments: {$in: commentObjectIds}}});

      // Remove from likes/ dislikes
      const bitRemoveFromLikes = await usersCollection.update({likes: {$in: [bitObjectId]}}, {$pull: {likes: {$in: [bitObjectId]}}});
      const bitRemoveFromDislikes = await usersCollection.update({dislikes: {$in: [bitObjectId]}}, {$pull: {dislikes: {$in: [bitObjectId]}}});
      const commentsRemoveFromLikes = await usersCollection.update({likedComments: {$in: commentObjectIds}}, {$pull: {likedComments: {$in: commentObjectIds}}});
      const commentRemoveFromDislikes = await usersCollection.update({dislikedComments: {$in: commentObjectIds}}, {$pull: {dislikedComments: {$in: commentObjectIds}}});
    }
    else {
      return res.status(500).send('Attempt to delete post not owned by user.');
    }

    // Close connection
    client.close();
    return res.status(200).send('Successfully deleted post.');
  } catch (error) {
    // Handle Errors
    res.status(500).send('Error deleting post: ' + error.message);
  }
};



