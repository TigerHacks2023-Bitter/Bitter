const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

const postsPerPage = 10;

exports.getBits = async (req, res) => {
  const page = parseInt(req.body.page) || 1; // Get the requested page from the body

  if (!page || page < 1) {
    return res.status(400).send('Invalid page number');
  }

  try {
    // Create Client and connect
    const client = new MongoClient(mongoURI, { useNewUrlParser: true });
    await client.connect();
    const db = client.db('Bitterr-Test');

    // Bits Colletion
    const collection = db.collection('bits');

    const skipCount = (page - 1) * postsPerPage;

    // Get Posts descending order by likes, starting at spiCount and only showing postsPerPage amount
    const cursor = collection.find()
      .sort({ likes: -1 })
      .skip(skipCount)
      .limit(postsPerPage);

    // Convert the cursor to an array of the posts for the requested page
    const posts = await cursor.toArray();

    // If Posts are empty
    if (posts.length === 0) {
      return res.status(404).send('No more posts found');
    }

    // Return Posts
    client.close();
    res.status(200).json(posts);
  } catch (error) {
    // Handle errors
    res.status(500).send('Error retrieving posts: ' + error.message);
  }
};