const express = require('express');
const app = express();
const port = 3002;
const morgan = require("morgan");
app.use(morgan("combined"))

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const cors = require("cors");
app.use(cors())
const { MongoClient, ObjectId  } = require('mongodb');

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const database = client.db("FashionData");
const fashionCollection = database.collection("Fashion");
const userCollection = database.collection("user");

app.listen(port, () => {
    console.log(`My Server listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("This Web server is processed for MongoDB");
});

app.get("/fashions", cors(), async (req, res) => {
    const result = await fashionCollection.find({}).toArray();
    res.send(result);
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userCollection.findOne({ username, password });
        if (user) {
            res.status(200).send({ message: "User found", user });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/fashions/:id",cors(),async (req,res)=>{
    var o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({_id:o_id}).toArray();
    res.send(result[0])
    }
    )

app.post("/fashions", cors(), async (req, res) => {
    try {
        const fashion = req.body;
        await fashionCollection.insertOne(fashion);
        res.status(201).send(fashion);
    } catch (error) {
        res.status(500).send(error);
    }
});