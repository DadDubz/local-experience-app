const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://localexperienceapp:<your_password>@local-experience-app.4c0fs.mongodb.net/?retryWrites=true&w=majority&appName=local-experience-app";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
