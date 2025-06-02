const Item = require('../models/itemModel');
const connectDB = require('./config/database');

// Get all items
exports.getAllItems = async (req, res) => {
    try {
            await connectDB();
        const items = await Item.find();
        res.status(200).json(items?.[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new item
exports.createItem = async (req, res) => {
    try {
            await connectDB();
        await Item.deleteMany({});

        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
            await connectDB();
        // Find the item first to make sure it exists
        const item = await Item.findOne();
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Dynamically construct the path for the nested update
        const updatePath = `${req.params.page}.${req.params.section}`;

        // Use the $set operator to update the specific section in the array or document
        const updatedItem = await Item.findByIdAndUpdate(
            item._id,
            {
                $set: { [updatePath]: req.body }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};