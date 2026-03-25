const { Bid, Crop, initDb } = require('./database.js');
initDb().then(async () => {
    const bids = await Bid.findAll({ include: [Crop] });
    console.log(JSON.stringify(bids, null, 2));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
