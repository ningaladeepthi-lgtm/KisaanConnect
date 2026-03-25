const express = require('express');
const cors = require('cors');
const { initDb, User, Crop, Bid, Equipment, RentalRequest } = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- API ROUTES ---

// Deleted root route to allow static index.html to load

// 1. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'KisaanConnect Backend is running!' });
});

// 2. CROPS
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await Crop.findAll({ include: [User] });
        res.json(crops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/crops', async (req, res) => {
    try {
        const farmer = await User.findOne({ where: { role: 'Farmer' } });
        if (!farmer) return res.status(404).json({ error: 'No farmer found to link crop.' });

        const newCrop = await Crop.create({
            type: req.body.type,
            quantity_kg: req.body.qty,
            price_per_kg: req.body.price,
            farmerId: farmer.id
        });

        // Simulating Wholesaler Bid creation automatically for Demo platform
        // Randomize delay between 2 and 6 seconds to prevent SQLite lock collisions
        const randomDelay = Math.floor(Math.random() * 4000) + 2000;
        setTimeout(async () => {
            try {
                const wholesaler = await User.findOne({ where: { role: 'Wholesaler' } });
                if (wholesaler) {
                    const mockBidPrice = parseFloat(req.body.price) - Math.floor(Math.random() * 3);
                    await Bid.create({
                        bid_amount: mockBidPrice > 0 ? mockBidPrice : parseFloat(req.body.price),
                        cropId: newCrop.id,
                        wholesalerId: wholesaler.id
                    });
                }
            } catch(e) { console.error('Simulated bid error:', e); }
        }, randomDelay);

        res.status(201).json({ message: 'Crop successfully listed', data: newCrop });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. EQUIPMENT
app.get('/api/equipment', async (req, res) => {
    try {
        const { village } = req.query;
        let whereClause = {};

        if (village && village !== 'all') {
            whereClause.village = village;
        }

        const equipments = await Equipment.findAll({
            where: whereClause,
            include: [User]
        });

        res.json(equipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/equipment', async (req, res) => {
    try {
        const farmer = await User.findOne({ where: { role: 'Farmer' } });

        const newEquipment = await Equipment.create({
            name: req.body.name,
            village: req.body.village,
            rate_per_day: req.body.rate,
            ownerId: farmer ? farmer.id : null
        });

        res.status(201).json({ message: 'Equipment listed globally', data: newEquipment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. BIDS
app.get('/api/bids', async (req, res) => {
    try {
        const bids = await Bid.findAll({ include: [Crop, User] });
        res.json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Initialize DB and Start Server
initDb().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});