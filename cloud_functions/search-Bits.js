const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';
// Replace placeholders with your MongoDB credentials and database information

exports.searchBits = async (req, res) => {
  const query = req.body.message; // Get the search query from the request query

  if (!query) {
    return res.status(400).send('Missing search query');
  }

  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true });
    await client.connect();

    const db = client.db('Bitterr-Test'); // Use your database name

    const collection = db.collection('bits'); // Use your collection name

    // Use the `find()` method with a regular expression for partial matching
    const cursor = collection.find({ message: { $regex: query, $options: 'i' } })
          .sort({ likes: -1 });

    // Convert the cursor to an array of matching documents
    const matchingDocuments = await cursor.toArray();

    if (matchingDocuments.length === 0) {
      return res.status(404).send('No documents matching the query found');
    }

    // Return the array of matching documents in the response
    res.status(200).json(matchingDocuments);
  } catch (error) {
    res.status(500).send('Error retrieving documents: ' + error.message);
  } finally {
    client.close();
  }
};



