const express = require('express'); 
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Also handle JSON requests

// Load local JSON files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });

// Load Mongoose Models
const Reviews = require('./review');
const Dealership = require('./dealership');

// ========== API ENDPOINTS ==========

// Get all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        const reviews = await Reviews.find({});
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Get reviews for a specific dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const dealer_id = parseInt(req.params.id);
        const reviews = await Reviews.find({ dealership: dealer_id });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews by dealer ID' });
    }
});

// ✅ GET all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const dealers = await Dealership.find({});
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dealers' });
    }
});

// ✅ GET dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const state = req.params.state;
        const dealers = await Dealership.find({ state: state });
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dealers by state' });
    }
});

// ✅ GET single dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);
        const dealer = await Dealership.findOne({ id: dealerId });
        res.json(dealer);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dealer by ID' });
    }
});

// Insert a new review
app.post('/insert_review', async (req, res) => {
    try {
        const newReview = new Reviews(req.body);
        await newReview.save();
        res.json({ status: 'success', review: newReview });
    } catch (err) {
        res.status(500).json({ error: 'Failed to insert review' });
    }
});

// ========== Start the server ==========
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
