const { ObjectId, MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.getComments = async (req, res) => {
  try {
    const body = req.body;
    const bitId = body.bitId;

    // Verify bitId exists
    if (!bitId) {
      console.log('No bit Id provided in body:');
      console.log(body);
      res.status(500).send('No bit Id provided in body.');
    }

    // Get bitObjectId
    const bitObjectId = new ObjectId(bitId);

    //Create client and connect
    const client = new MongoClient(mongoURI, { useNewUrlParser: true });
    await client.connect();
    const db = client.db('Bitterr-Test');

    // bits Collection
    const collection = db.collection('bits');
    const commentCollection = db.collection('comments');

    // Get the bit Object
    const bitObject = await collection.findOne({_id: bitObjectId});
    const bitComments = bitObject.comments;

    // Get the comments array
    const commentArray = await commentCollection.find({ _id: { $in: bitComments } }).toArray();

    // Return the comment Object
    client.close();
    res.status(200).json(commentArray);
  } catch (error) {
    //Handle Errors
    res.status(500).send('Error retrieving comments: ' + error.message);
  }
};