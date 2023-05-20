const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const data = require('./data.json')

// database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5bylxu.mongodb.net/?retryWrites=true&w=majority`;
// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`the play station server is running on`)
});
;






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const toysCollection = client.db('playStationDB').collection('toyStore');

        app.get('/toys', async (req, res) => {
            const cursor = toysCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const cursor = toysCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/hot', async (req, res) => {
            const query = { hot: "hot" }
            const cursor = toysCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/best', async (req, res) => {
            const query = { rating: { $gt: 4 } };
            const cursor = toysCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/category/:sub', async (req, res) => {
            const subCategory = req.params.sub
            const query = { sub_category: `${subCategory}` };
            const cursor = toysCollection.find(query);
            const result = await cursor.toArray()

            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`the server is run on port ${port}`)
})
