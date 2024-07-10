const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ealpifc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const jobCollection=client.db('jobFinder').collection('job');
    const appliedJobCollection=client.db('jobFinder').collection('appliedJob');

    // job
    app.get('/jobs', async(req,res)=>{
      const category=req.query.job_category;
      console.log(category)
      let query = {};
            if (req.query ?.job_category) {
                query = {
                  job_category: req.query.job_category
                }
        }
        const result = await jobCollection.find(query).toArray();
        res.send(result);
    })

    // fetch single job
    app.get('/jobDetails/:id',async(req,res)=>{
      const id=req.params.id;
      const query={ _id: new ObjectId(id)};
      const result=await jobCollection.findOne(query);
      res.send(result);
    })



    // add job to the server
    app.post('/jobs',async(req,res)=>{
        const job=req.body;
        const result=await jobCollection.insertOne(job);
        res.send(result);
    })

    app.patch('/jobs/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={ _id: new ObjectId(id)}
      const updateDoc={ $inc: {job_Applicants: 1}};
      const result=await jobCollection.updateOne(filter,updateDoc)
      res.send(result);
    })



// appied job section
app.post('/appliedJob',async(req,res)=>{
  const appliedJob=req.body;
  const result=await appliedJobCollection.insertOne(appliedJob);
  res.send(result);
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





app.get('/', (req,res)=>{
    res.send('Job finder is running');
})

app.listen(port,()=>{
    console.log(`job finder server is running on port ${port}`);
})