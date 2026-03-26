const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

// 1. User Model
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('Farmer', 'Wholesaler', 'Admin'), allowNull: false },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false }
});

// 2. Crop Model
const Crop = sequelize.define('Crop', {
    type: { type: DataTypes.STRING, allowNull: false },
    quantity_kg: { type: DataTypes.INTEGER, allowNull: false },
    price_per_kg: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Sold', 'Hidden'), defaultValue: 'Active' }
});

// 3. Bid Model
const Bid = sequelize.define('Bid', {
    bid_amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'), defaultValue: 'Pending' }
});

// 4. Equipment Model
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

// Relationships

User.hasMany(Crop, { foreignKey: 'farmerId' });
Crop.belongsTo(User, { foreignKey: 'farmerId' });

User.hasMany(Bid, { foreignKey: 'wholesalerId' });
Bid.belongsTo(User, { foreignKey: 'wholesalerId' });

Crop.hasMany(Bid, { foreignKey: 'cropId' });
Bid.belongsTo(Crop, { foreignKey: 'cropId' });

User.hasMany(Equipment, { foreignKey: 'ownerId' });
Equipment.belongsTo(User, { foreignKey: 'ownerId' });

User.hasMany(RentalRequest, { foreignKey: 'borrowerId' });
RentalRequest.belongsTo(User, { foreignKey: 'borrowerId' });

Equipment.hasMany(RentalRequest, { foreignKey: 'equipmentId' });
RentalRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });

// Initialize DB
async function initDb() {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Connection established successfully.');

        await sequelize.query('PRAGMA journal_mode=WAL;');
        await sequelize.sync({ alter: true });

        console.log('✅ All Database models were synchronized successfully.');

        // Seed data (only if empty)
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('🌱 Seeding Farmer...');
            await User.create({ name: 'Ramesh K.', role: 'Farmer', phone: '9876543210' });
        }

        const wholesalerCount = await User.count({ where: { role: 'Wholesaler' } });
        if (wholesalerCount === 0) {
            console.log('🌱 Seeding Wholesaler...');
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