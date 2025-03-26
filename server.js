require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON Parsing
app.use(cors());
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

connectDB();

// Reference to a Collection
const database = client.db("quizDB"); // Change 'quizDB' to your database name
const collection = database.collection("submissions");

// Sample GET API
app.get("/", (req, res) => {
  res.send("🚀 Server is running with MongoDB Atlas!");
});

// POST - Save Data to MongoDB
app.post("/api/data", async (req, res) => {
  try {
    const data = req.body;

    console.log("data submission", data);
    const result = await collection.insertOne(data);
    res.status(201).json({ message: "Data saved successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Error saving data", details: error });
  }
});

// GET - Fetch All Data
app.get("/api/data", async (req, res) => {
  try {
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data", details: error });
  }
});

// DELETE - Remove Data by ID
app.delete("/api/data/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting data", details: error });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
