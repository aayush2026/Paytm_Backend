const express = require("express");

const app=express()
const cors=require("cors")

app.use(cors())
app.use(express.json())
const MainRouter=require("./routes/index")

app.use("/api/v1", MainRouter)

app.listen(3000, ()=>{
  console.log('Server isrunning on port 3000')
})


