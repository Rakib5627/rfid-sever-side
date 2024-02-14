const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// rakibul29302
// ZnsFNvhQUGcmklke


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rakibul29302:ZnsFNvhQUGcmklke@cluster0.y5comcm.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const userCollection = database.collection("users");

// to read or send data to client page (db theke client page a jbe)

    app.get("/users", async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // find a document 

    app.get("/users/:userId" , async(req , res) => {
      const userId = req.params.userId;
    
      const query = { userId };
    
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //  find multiple document 

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log('new user', user);

      const result = await userCollection.insertOne(user);
      res.send(result);

    })
    
    app.put("/users/:userId" , async(req , res) => {
      const userId = req.params.userId;
      const user = req.body;
    
      const filter = { userId };
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name : user.name,
          email : user.email,
          gender: user.gender,
          password: user.password
        },
      };
    
      const result = await userCollection.updateOne(filter , updateUser ,options );
      res.send(result);
    });
    
    app.delete("/users/:userId" , async(req , res) => {
      const userId = req.params.userId;
    
      const query = { userId };
    
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    


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
  console.log(`server running on port : ${port}`)
})