import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
mongoose.connect(process.env.MONGODB_URI + '/car-rental').then(async () => {
    const Car = mongoose.model('Car', new mongoose.Schema({}, {strict: false}));
    const updated = await Car.updateOne(
        { brand: 'Mercedes-AMG', model: 'GT' },
        {
            $set: {
                brand: 'BMW',
                model: 'M3 Coupe',
                category: 'Coupe',
                description: 'The BMW M3 Coupe is an iconic high-performance sports car offering precision handling, dynamic power, and aggressive styling.'
            }
        }
    );
    console.log('Updated car in DB:', updated);
    process.exit(0);
});
