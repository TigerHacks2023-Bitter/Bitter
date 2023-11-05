const { ObjectId, MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.deleteComment = async (req, res) => {
  try {
    // Get userId and message
    const body = req.body;
    const userId = body.userId;
    const commentId = body.commentId;

    // Verify userID and message exist
    if (!userId || !commentId) {
      console.log('Missing a parameter in body:');
      console.log(body);
      return res.status(500).send('Missing parameter in body.');
    }

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('Bitterr-Test');

    // Bits Collection
    const bitsCollection = database.collection('bits');
    const usersCollection = database.collection('users');
    const commentsCollection = database.collection('comments');

    // Create Object Ids
    const commentObjectId = new ObjectId(commentId);
    const bitObjectId = commentsCollection.findOne({_id: commentObjectId}).parentBitId;
    const userObjectId = new ObjectId(userId);
    
    // If the user is the owner of the post, delete it
    const isUserPost = usersCollection.findOne({_id: userObjectId, comments: {$in: [commentObjectId]}});
    if (isUserPost) {
      // Delete objects
      const bitRemove = await bitsCollection.updateOne({_id: bitObjectId}, {$pull: {comments: {$in: [commentObjectId]}}});
      const commentRemove = await commentsCollection.deleteOne({_id: commentObjectId});
      const userRemove = await usersCollection.updateOne({_id: userObjectId}, {$pull: {comments: {$in: [commentObjectId]}}});

      // Delete from likes/ dislikes
      const commentLikeRemove = await usersCollection.update({likedComments: {$in: [commentObjectId]}}, {$pull: {likedComments: {$in: [commentObjectId]}}});
      const commentDislikeRemove = await usersCollection.update({dislikedComments: {$in: [commentObjectId]}}, {$pull: {dislikedComments: {$in: [commentObjectId]}}});

    }
    else {
      return res.status(500).send('Attempt to delete comment not owned by user.');
    }

    // Close connection
    client.close();
    return res.status(200).send('Successfully deleted comment.');
  } catch (error) {
    // Handle Errors
    res.status(500).send('Error deleting comment: ' + error.message);
  }
};
