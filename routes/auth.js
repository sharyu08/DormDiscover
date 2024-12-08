// auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// Sign Up Route
router.post('/signup', async (req, res) => {
    
    const { name, email, password, confirmPassword } = req.body;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required.');
    }
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }
    
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email is already registered.');
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Server error. Please try again later.');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }
    
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password.');
        }
        
        res.send('Login successful!');
    } catch (error) {
        res.status(500).send('Server error. Please try again later.');
    }
});

module.exports = router;
