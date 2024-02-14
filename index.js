require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { EventEmitter } = require("events");
const morgan = require("morgan");
const eventEmitter = new EventEmitter();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

// rakibul29302
// ZnsFNvhQUGcmklke

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rakibul29302:ZnsFNvhQUGcmklke@cluster0.y5comcm.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    // to read or send data to client page (db theke client page a jbe)

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // find a document

    app.get("/users/:userId", async (req, res) => {
      const userId = req.params.userId;

      const query = { userId };

      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //  find multiple document

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.put("/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const user = req.body;

      const filter = { userId };
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          password: user.password,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updateUser,
        options
      );
      res.send(result);
    });

    app.delete("/users/:userId", async (req, res) => {
      const userId = req.params.userId;

      const query = { userId };

      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Endpoint for receiving data from NodeMCU
    app.post("/data", (req, res) => {
      const newData = req.body;
      // Emit an event to notify connected clients about new data
      eventEmitter.emit("newData", newData); //to client side
      res.sendStatus(200); //to nodeMCU
    });

    // Endpoint for clients to subscribe to real-time updates
    app.get("/events", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const listener = (newData) => {
        res.write(`data: ${JSON.stringify(newData)}\n\n`);
      };

      eventEmitter.on("newData", listener);

      req.on("close", () => {
        eventEmitter.off("newData", listener);
      });
    });
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
