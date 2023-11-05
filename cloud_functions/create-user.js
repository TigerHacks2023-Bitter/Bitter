const { MongoClient } = require('mongodb');

// Connection URI 
const uri = 'mongodb+srv://bitterr-test:F3wCfwGrZl1UkvaW@bitterrcluster.pgbjaou.mongodb.net/Bitterr-Test';

exports.createUser = async (req, res) => {
    try {
        // Grab Message
        const body = req.body;
        const userName = body.userName;
        const firstName = body.firstName;
        const lastName = body.lastName;
        const password = body.password;
        const userEmail = body.email;

        // Verify Email exists
        if (!userEmail || !userName || !firstName || !lastName || !password) {
            console.log('Parameter missing in request:');
            console.log(body);
            res.status(500).send('Parameter missing in request.');
            return;
        }
        
        // Create a client and connect
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db('Bitterr-Test');
        const collection = database.collection('users');

        // Check if there is already an account with a given email
        const existingValue = await collection.findOne({$or: [
            { email: userEmail },
            { userName: userName }
        ]});

        // If it exists, exit
        if (existingValue) {
            client.close();
            res.status(500).send('An account already exists for that username/email.');
        } else {
            const userObject = { 
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                password: password,
                email: userEmail,
                bits: [],
                comments: [],
                likes: [],
                dislikes: [],
                likedComments: [],
                dislikedComments: [],
                comments: []
            };
            console.log(userObject);

            // Insert userObject
            const result = await collection.insertOne(userObject);

            // Close the connection
            await client.close();
            res.status(200).send('User successfully created.');
        }
    } catch (err) {
        // Handle any errors
        console.log(err);
        console.error('Error occurred:', err);
        res.status(500).send('Error adding object to MongoDB');
    }
};