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
        const toolCollection = client.db("Sabitmanufacturer").collection('Tools')
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
            const query = { _id:id }
            const cursor = await toolCollection.findOne(query)
            res.send(cursor)
        });

    }
    finally{

    }

}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });   