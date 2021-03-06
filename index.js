const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv').config()
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello World!')
})



const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afp1qhg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        console.log('try')
        await client.connect()
        const toolCollection = client.db("Sabitmanufacturer").collection('Tools');
        const totalOrder = client.db("Sabitmanufacturer").collection('total-order')
        const totalReviews = client.db("Sabitmanufacturer").collection('total-review')
        const userCollection = client.db("Sabitmanufacturer").collection("user")
        // -------------------------------------------------------------------------------
        app.get("/tools", async (req, res) => {
            // console.log('inside inventory')
            const query = {}
            const cursor = toolCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        //-------------------specific oe item get
        app.get("/tools/:id", async (req, res) => {
            // console.log(req);
            const id = req.params.id
            // console.log(id)
            const query = { _id: id }
            const cursor = await toolCollection.findOne(query)
            res.send(cursor)
        });
        //for showinf ordered item----------------
        app.post("/ordereditem", async (req, res) => {

            const doc = req.body;
            const result = await totalOrder.insertOne(doc);

            res.send(result)
        });
        app.get("/ordereditem", async (req, res) => {
            // console.log('inside inventory')
            const query = {}
            const cursor = totalOrder.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post("/tools", async (req, res) => {
            // console.log('inside inventory')
            const query = req.body
            const cursor = await toolCollection.insertOne(query)

        })
        app.get("/ordereditem/:email", async (req, res) => {
            // console.log(req);
            const email = req.params.email
            console.log()
            // console.log(id)
            const query = { email: email }
            const cursor = await totalOrder.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });
        //--------delete a item---------------------------------------

        app.delete("/ordereditem/:id", async (req, res) => {

            const doc = req.params.id;
            console.log(doc);
            const query = { _id: ObjectId(`${doc}`) };
            console.log(query)
            const cursor = await totalOrder.deleteOne(query);

            res.send(cursor)
        });
        //------------------store reviews in db
        app.post("/review", async (req, res) => {
            console.log('ashche');
            const doc = req.body;
            const result = await totalReviews.insertOne(doc);

            res.send(result)
        });
        app.get("/review", async (req, res) => {
            // console.log('inside inventory')
            const query = {}
            const cursor = totalReviews.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        //-----------------user handle for admin section
        app.post("/user", async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user);

            res.send(result)
        })
        app.get("/user", async (req, res) => {
            const email = req.query
            const result = await userCollection.findOne(email)
            res.send(result)
        })
        // app.get("/user/profile", async (req, res) => {
        //     const email = {}
        //     const result = userCollection.find(email)
        //     const cursor = await result.toArray()
        //     res.send(cursor)
        // })
        app.put("/user", async (req, res) => {
            const email2 = req.query
            const data = req.body
            const options = { upsert: true }
            const updateDoc = {
                $set: data
            };
            const result = await userCollection.updateOne(email2, updateDoc, options);
        })
        app.delete("/tools/:id", async (req, res) => {

            const doc = req.params.id;
            console.log(doc);
            const query = { _id: ObjectId(`${doc}`) };
            console.log(query)
            const cursor = await totalOrder.deleteOne(query);

            // res.send(cursor,cur)
        });
        // app.put('/user/profile', async (req, res) => {
        //     const email = req.query
        //     console.log(email)
        //     const data = req.body
        //     const updateDoc = {
        //         $set: {
        //             role: "admin"
        //         }
        //     };
        //     const result = await profileColletions.updateOne(email, updateDoc)
        //     res.send(result)
        // })

    }
    finally {

    }

}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});   