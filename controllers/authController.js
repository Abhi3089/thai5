const authController = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


authController.post("/register", async (req, res) => {
  try {
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      return res.status(202).json({ msg: "User already registered" });
    }

    if (req.body.username === "" || req.body.email === "" || req.body.password === "") {
      return res.status(202).json({ msg: "All fields must be populated" });
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    
    // const newUser = new User({
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: hashedPassword
    // })
    
    
    //const savedUser = await newUser.save()
    const savedUser = await User.create({ ...req.body, password: hashedPassword });
    await savedUser.save();
    
    const {password, ...others} = savedUser._doc;
  
    const token = createToken(savedUser);
    const msg = "Sucessfully Registered";
    return res.status(201).json({ others, token ,msg});

  } catch (error) {

   res.status(500).json({ msg: "Something went wrong", error });
  }
});

authController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(500).json({ msg: "All fields must be populated" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(202).json({ msg: "Invalid credentials" });
    }
    const comparePass = await bcrypt.compare(req.body.password, user.password);
    if (!comparePass) {
      return res.status(202).json({ msg: "Invalid credentials" });
    }

    const {password, ...others} = user._doc
    const token = createToken(user);
    const msg="login successfully";

    return res.status(200).json({ others, token ,msg});
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Logout API
authController.post('/logout', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user's token
    user.tokens = user.tokens.filter(token => token.token !== req.token);
    await user.save();

    res.status(200).json({ msg: 'User logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

module.exports = authController;