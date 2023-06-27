// import express from "express";
// import mongoose from "mongoose";

// import "./models/user.js"; // load
// import authRouter from "./routes/auth.js";
const express = require("express");
const mongoose = require("mongoose");
require("./models/user.js"); // load
const authRouter = require("./routes/auth.js");
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 5000;


// Database connection: // abhi123// WMPC7NkXiMYfWKe2
mongoose.connect("mongodb+srv://abhi123:WMPC7NkXiMYfWKe2@auth.vshotk7.mongodb.net/")
mongoose.connection.on("connected", () => {console.log("Connected to database")})
mongoose.connection.on("error", () => {console.log("Error connecting to database")})

// Middleware: 

app.use(express.json()) 
app.use("/api/auth", authRouter);





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})