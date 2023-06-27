const express = require('express');
const mongoose = require('mongoose');
const user = mongoose.model("User");


const isLoggedIn = async (req, res, next) => {
     
    let token = req.headers.authorization
    // console.log("token", token) // "Bearer 6d1a2939-b078-4888-be36-12febfe21404"

    token = token.split(" ")[1]  
    //   token = token.replace("Bearer ", "")
    try{ 
       let foundUser = await user.findOne({token: token})
         if(!foundUser){
                return res.send({error: "User not found"})
         }
          req.user = foundUser
          next()

    }
    catch(err){
          console.log("Token is invalid",err)
          return res.send({error: "Token is invalid"})
    }






}

module.exports = isLoggedIn;