import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const server = express();

dotenv.config({ path: "./config.env" });

server.use(express.json());
server.use(cors());

const DB = process.env.DATABASE;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.KEY;

// Connect to the MongoDB database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});
const User = mongoose.model("User", userSchema);

// Helper function to create a JWT token
function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
}

// Registration route
server.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists, Go to Login!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = createToken(newUser);
    res.json({ message: "Registration Successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register!" });
  }
});

// Login route
server.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "You are not registered, Register Now!" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Incorrect password, Enter correct password!" });
    }
    const token = createToken(user);
    res.json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// Password reset route
server.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password!" });
  }
});

//Item schema and model
const itemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", itemSchema);

server.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

server.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

server.delete("/api/items/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
