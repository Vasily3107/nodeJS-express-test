const mongoose = require('mongoose');
const express = require('express');

const coinSchema = new mongoose.Schema({
    material: String,
    year: Number,
    country: String,
    value: Number,
    auction_price: Number
});
const Coin = mongoose.model('Coin', coinSchema);

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin@cluster0.5ivypqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.get('/coins/:id', async (req, res) => {
    try {
        const coin = await Coin.findById(req.params.id);
        if (!coin) return res.status(404).send('Coin not found');
        res.json(coin);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/coins', async (req, res) => {
    try {
        const { material, year, country, value, auction_price } = req.body;
        const coin = new Coin({ material, year, country, value, auction_price });
        await coin.save();
        res.status(201).json(coin);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/coins/:id', async (req, res) => {
    try {
        const { material, year, country, value, auction_price } = req.body;
        const updateData = {};

        if (     material) updateData.material = material;
        if (         year) updateData.year = year;
        if (      country) updateData.country = country;
        if (        value) updateData.value = value;
        if (auction_price) updateData.auction_price = auction_price;

        const coin = await Coin.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!coin) return res.status(404).send('Coin not found');
        res.json(coin);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/coins/:id', async (req, res) => {
    try {
        const coin = await Coin.findByIdAndDelete(req.params.id);
        if (!coin) return res.status(404).send('Coin not found');
        res.json(coin);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 12345;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// http://127.0.0.1:12345/
