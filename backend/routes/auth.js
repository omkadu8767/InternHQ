const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TaskAssignment = require('../models/TaskAssignment')
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'okisalwaysok';

// Route 1: Register a new user (admin/mentor or intern)
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('isAdmin').optional().isBoolean()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            isAdmin: req.body.isAdmin === true   // true for admin, false/default for intern
        });

        const data = { user: { id: user.id, isAdmin: user.isAdmin } };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 2: Login user (returns isAdmin in payload)
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }
        const data = { user: { id: user.id, isAdmin: user.isAdmin } };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 3: Get logged-in user details (excluding password)
router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 3: Delete an intern (Admin only)
router.delete('/admin/interns/:internId', fetchuser, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send({ error: "Access denied" });
    try {
        // Delete the user
        await User.findByIdAndDelete(req.params.internId);
        // Optionally, delete all their assignments
        await TaskAssignment.deleteMany({ intern: req.params.internId });
        res.json({ success: true, message: "User deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
