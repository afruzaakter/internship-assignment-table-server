const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aegbdxu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        await client.connect();
        // console.log("DB Connect");
        const workCollection = client.db('workList').collection('work');

        //data post
        app.post('/work', async(req, res) =>{
            const newWork = req.body;
            const result = await workCollection.insertOne(newWork);
            res.send(result);
        })
          
        // get all data 
        app.get('/work', async(req, res) =>{
            const query = {};
            const cursor = workCollection.find(query);
            const works = await cursor.toArray();
            res.send(works);
        })
        
        app.get('/work/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const works = await workCollection.findOne(query);
            res.send(works);
        })

        // Delete Data
        app.delete('/work/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)}
            const result = await workCollection.deleteOne(query);
            res.send(result);
        })



    }

    finally{

    }
}


run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send("Hello from Data List")
})

app.listen(port, () =>{
    console.log("Listening port", port);
})