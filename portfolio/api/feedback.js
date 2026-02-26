import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

let cachedClient = null;

async function connectToDatabase() {
if (cachedClient) {
return cachedClient;
}

const client = new MongoClient(uri);
await client.connect();
cachedClient = client;
return client;
}

export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ message: "Method not allowed" });
}

try {

const client = await connectToDatabase();
const db = client.db("portfolioDB");

const { name, email, message } = req.body;

if (!name || !email || !message) {
return res.status(400).json({ message: "All fields required" });
}

await db.collection("feedbacks").insertOne({
name,
email,
message,
createdAt: new Date()
});

return res.status(200).json({
message: "Feedback submitted successfully!"
});

} catch (error) {
return res.status(500).json({
message: "Database error"
});
}
}
