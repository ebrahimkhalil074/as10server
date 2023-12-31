const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors =require("cors")
const app = express()
const port =  process.env.PORT || 3000
//middleware
app.use(cors())
app.use(express.json())
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dadactj.mongodb.net/?retryWrites=true&w=majority`;

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
   const productsCollection =client.db("productsDB").collection("products")
    const brandCollection =client.db("productsDB").collection("brands")
   const cartCollection =client.db("productsDB").collection("carts")

   app.get('/brands',async(req,res)=>{
    const cursor =brandCollection.find()
    const result =await cursor.toArray()
      res.send(result)
    })    
   app.get('/products',async(req,res)=>{
    const cursor =productsCollection.find()
    const result =await cursor.toArray()
      res.send(result)
    })    
app.get("/products/:id",async(req,res)=>{
const id =req.params.id
const query ={_id: new ObjectId(id)}
console.log(query);
const result = await productsCollection.findOne(query);
res.send(result)
})
app.get("/brands/:id",async(req,res)=>{
const id =req.params.id
const query ={_id: new ObjectId(id)}
console.log(query);
const result = await brandCollection.findOne(query);
res.send(result)
})

app.get("/carts/:id",async(req,res)=>{
  const id=req.params.id
  const query ={_id:new ObjectId(id)};
  const result =await cartCollection.findOne(query)
  res.send(result)
  });
 app.post('/carts',async(req,res)=>{
const cart= req.body
console.log(cart);
const result =cartCollection.insertOne(cart)
res.send(result)
})

   app.post('/products',async(req,res)=>{
const products= req.body
console.log(products);
const result =productsCollection.insertOne(products)
res.send(result)
})

app.get('/carts',async(req,res)=>{
  const cursor =cartCollection.find()
  const result =await cursor.toArray()
    res.send(result)
  }) 
  
 
   app.delete('/carts/:id',async(req,res)=>{
const id= req.params.id
console.log(id);
const query ={ _id :id};
console.log("id..",id,query);
 const result =cartCollection.deleteOne(query)
 res.send(result)
})


app.get('/brands',async(req,res)=>{
  const id=req.params.brand
  const query = { brand: id}
  const result =await productsCollection.findOne(query)
  res.send(result)
  })

   app.post('/brands',async(req,res)=>{
const brands= req.body
console.log(brands);
const result =brandCollection.insertOne(brands)
res.send(result)
})

app.put('/brands/:id',async(req,res)=>{
  const id=req.params.id
  const filter =  { _id: new ObjectId(id)}
  const options = { upsert: true };
  const updateProduct =req.body
  const product = {
    $set: {
      name:updateProduct.name,
      brand:updateProduct.brand,
      type:updateProduct.type,
      description:updateProduct.description,
      price:updateProduct.price,
      rating:updateProduct.rating,
      image:updateProduct.image 
    },
  };
  console.log(filter,product,options);
  const result =await brandCollection.updateOne(filter,product,options
    )
  res.send(result)
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

app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!!!!!!!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})