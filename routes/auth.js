
// import express from 'express';
// const authRouter = express.Router()
// import mongoose from "mongoose";
// const user =  mongoose.model("User");
// import bcrypt from "bcrypt";
// import {v4 as uuid4} from 'uuid';
// import isLoggedIn from "../middlewares/isLoggedIn.js";

const express = require('express');
const authRouter =  express.Router()
const mongoose = require("mongoose");
const user =  mongoose.model("User");
const bcrypt = require("bcrypt");
const { v4:uuid4 } = require('uuid'); 
const isLoggedIn = require("../middlewares/isLoggedIn.js");



authRouter.post("/signup", (req, res) => {
    //    console.log(req.body)
    //    res.send("Data received")
      const {name, email, password} = req.body;
   console.log(name,email,password)
      // validations: 

      if(!name || !email || !password){

          return res.send({error: "Please add all the fields"})
      }
     
      
      //  check if user email already exists in database: 

       user.findOne({email: email})
       .then(
            (savedUser)=>{
                if(savedUser){
                    return res.send({error: "User already exists with that email"})
                }
                
                bcrypt.hash(password, 10)
                .then((hashedPassword)=>{
                  // creating a new user object for User Model
                     if(!hashedPassword){
                        return res.send({error: "Password not hashed"})
                     }
          
          
                      let newUser = new user({
                        name: name,
                        email: email,
                        password: hashedPassword
                    })
          
                    newUser.save()  // async in nature
                    .then((savedUser)=>{
                       if(!savedUser){
                          return res.send({error: "User not saved"})
                       }
                       return res.send({success: true, message: "User saved successfully", data: savedUser})
                    })
                    .catch(err => console.log(err))
          
                })
          
                .catch(err=>console.log(err))

            }
       )

       .catch(err=>console.log(err))


      // let newUser = new user({
      //    name, email, password
      // })
      // password hashing: 

     

})


authRouter.post("/login", (req, res) => {
      const {email, password} = req.body;

      if(!email || !password){
         return res.send({error: "Please add all the fields"})
      }
      // email validation //  regex 
      
      user.findOne({email: email})
        .then((foundUser)=>{
              console.log("foundUser", foundUser)// {id: , name: "abhi", email: "abhi", password: ""}
              if(foundUser == null){
                  return res.send({error: "User not found"})
              }
              // compare password:
              bcrypt.compare(password, foundUser.password)
                .then((result)=>{
                     if(result == false){
                        return res.send({error: "Invalid password"})
                     }
                      // generate token:  
                      let token = uuid4();
                      foundUser.token = token;
                      foundUser.save()
                      .then((savedUser)=>{
                        return res.send({success: true, message: "User logged in successfully", data: savedUser})
                      })

                      .catch(err=>console.log("issue while saving token in database",err))

                    
                })

        })


      .catch(err=>console.log("issue while searching email in datbase",err))



})


authRouter.get("/secret1",isLoggedIn, (req, res)=>{
    //  check if user is logged in or not
     return res.send({success: true, message: "You are authorized to be a Raw Agent", loggedInAgentDetails: req.user})
})



authRouter.delete("/logout", isLoggedIn, async(req, res)=>{
     req.user.token = null;
     try{
        let savedUser = await req.user.save()
        return res.send({success: true, message: "User logged out successfully", data: savedUser})
     }
      catch(err){
        console.log("Logout Failed",err)
      }

})




// export default authRouter;

module.exports = authRouter;

