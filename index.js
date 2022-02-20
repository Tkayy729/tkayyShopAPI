const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");


const UserRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/Product");

dotenv.config();


mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDB connected successfully! "))
.catch((err) => console.log(err));


app.use(express.json());
app.use("/api/users", UserRoute)
app.use("/api/auth" , authRoute)
app.use("/api/products" , productRoute)



app.listen(process.env.PORT || 5000, () => console.log("Backend Server is running on port 5000"));


