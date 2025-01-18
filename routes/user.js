const express = require("express")

const router = express.Router();
const zod=require("zod");
const jwt = require("jsonwebtoken")
const { User, Account } = require("../DB/db");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middlewares");

const signupSchema = zod.object({
  username:zod.string().email(),
  firstname:zod.string(),
  lastname:zod.string(),
  password:zod.string(),
})

router.post("/signup", async (req,res) =>{
  const {success}= signupSchema.safeParse(req.body);
  if(!success){
    return res.status(411).json({
      message:"Email already taken/ Incorrect inputs"
    })
  }
  //find if user exists?
  const existingUser = await User.findOne({
    username:req.body.username
  })
  if(existingUser){
    return res.status(411).json({
      message:"Email already taken/ Incorrect inputs"
    })
  }
  //if user does not exists, create in database
  const user= await User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  })

  const userId=user._id

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
  })

  const token = jwt.sign({
    userId
  }, JWT_SECRET)

  res.json({
    message:"User created succensfully",
    token:token
  })
})

const signinSchema=zod.object({
  username:zod.string().email(),
  password:zod.string()
})

router.post("/signin", async (req,res)=>{
  const {success}=signinSchema.safeParse(req.body);
  if(!success){
    return res.status(411).json({
      message:"Email already taken/ Incorrect inputs"
    })
  }

  const user = await User.findOne({
    username:req.body.username,
    password:req.body.password
  })

  if(user){
    const token =jwt.sign({
      userId:user._id
    },JWT_SECRET)

    res.json({
      token:token
    })
    return;
  }

  res.status(411).json({
    message:"Error while logging in"
  })
})

const updateSchema=zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
})

router.put("/", authMiddleware,async(req,res)=>{
  const {success}=updateSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
        message: "Error while updating information"
    })
  }

  await User.updateOne(req.body, {
    id: req.userId
  })
  res.json({
    message: "Updated successfully"
  })
})

router.get("/bulk", async(req,res)=>{
  const filter=req.query.filter || "";
  const users=await User.find({
    $or:[{
      firstname:{
        "$regex":filter
      }
    },{
      lastname:{
        "$regex":filter
      }
    }]
  })

  res.json({
    user:users.map(user=>({
      _id:user._id,
      username:user.username,
      firstName:user.firstname,
      lastName:user.lastname
    }))
  })
})

module.exports=router;
