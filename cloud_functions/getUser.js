const { ObjectId, MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.getUser = async (req, res) => {
  try {
    const body = req.body;
    const email = body.email;

    // Verify UserId exists
    if (!email) {
      console.log('No email provided in body:');
      console.log(body);
      res.status(500).send('No email provided in body.');
    }

    //Create client and connect
    const client = new MongoClient(mongoURI, { useNewUrlParser: true });
    await client.connect();
    const db = client.db('Bitterr-Test');

    // Users Collection
    const collection = db.collection('users'); 

    // Get the email Object
    const userObject = await collection.findOne({email: email});

    // Return the email Object
    client.close();
    res.status(200).json(userObject);
  } catch (error) {
    //Handle Errors
    res.status(500).send('Error retrieving user: ' + error.message);
  }
};