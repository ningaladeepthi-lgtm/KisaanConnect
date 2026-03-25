const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false // Disable console logging of SQL queries
});

// Define Database Models

// 1. User Model
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('Farmer', 'Wholesaler', 'Admin'), allowNull: false },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false }
});

// 2. Crop Model (Listed by Farmers)
const Crop = sequelize.define('Crop', {
    type: { type: DataTypes.STRING, allowNull: false },
    quantity_kg: { type: DataTypes.INTEGER, allowNull: false },
    price_per_kg: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Sold', 'Hidden'), defaultValue: 'Active' }
});

// 3. Bid Model (Wholesalers bidding on Crops)
const Bid = sequelize.define('Bid', {
    bid_amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'), defaultValue: 'Pending' }
});

// 4. Equipment Model (Rentals)
const Equipment = sequelize.define('Equipment', {
    name: { type: DataTypes.STRING, allowNull: false },
    village: { type: DataTypes.STRING, allowNull: false },
    rate_per_day: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Available', 'Rented'), defaultValue: 'Available' }
});

// 5. Rental Request Model
const RentalRequest = sequelize.define('RentalRequest', {
    days: { type: DataTypes.INTEGER, allowNull: false },
    total_cost: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Approved', 'Completed'), defaultValue: 'Pending' }
});

// Define Relationships
// A Farmer (User) owns multiple Crops
User.hasMany(Crop, { foreignKey: 'farmerId' });
Crop.belongsTo(User, { foreignKey: 'farmerId' });

// A Wholesaler (User) places multiple Bids on a Crop
User.hasMany(Bid, { foreignKey: 'wholesalerId' });
Bid.belongsTo(User, { foreignKey: 'wholesalerId' });
Crop.hasMany(Bid, { foreignKey: 'cropId' });
Bid.belongsTo(Crop, { foreignKey: 'cropId' });

// A Farmer (User) owns multiple Equipments
User.hasMany(Equipment, { foreignKey: 'ownerId' });
Equipment.belongsTo(User, { foreignKey: 'ownerId' });

// A User can request to rent an Equipment
User.hasMany(RentalRequest, { foreignKey: 'borrowerId' });
RentalRequest.belongsTo(User, { foreignKey: 'borrowerId' });
Equipment.hasMany(RentalRequest, { foreignKey: 'equipmentId' });
RentalRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });

// Sync database and create tables if they don't exist
async function initDb() {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Connection established successfully.');
        await sequelize.query('PRAGMA journal_mode=WAL;');
        await sequelize.sync({ alter: true }); // Updates tables to match models
        console.log('✅ All Database models were synchronized successfully.');
        
        // Count users to verify DB isn't entirely blank, if blank, maybe seed a mock user
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('🌱 Seeding initial mock Farmer user...');
            await User.create({ name: 'Ramesh K.', role: 'Farmer', phone: '9876543210' });
        }

        const wholesalerCount = await User.count({ where: { role: 'Wholesaler' } });
        if (wholesalerCount === 0) {
            console.log('🌱 Seeding initial mock Wholesaler user...');
            await User.create({ name: 'AgriCorp Buyer', role: 'Wholesaler', phone: '1122334455' });
        }
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

module.exports = {
    sequelize,
    initDb,
    User,
    Crop,
    Bid,
    Equipment,
    RentalRequest
};
