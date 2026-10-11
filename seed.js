import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ['owner', 'user'], default: 'user' },
    image: {type: String, default: ''},
},{timestamps: true})
const User = mongoose.model('User', userSchema);

const carSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    seating_capacity: {type: Number, required: true},
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvaliable: {type: Boolean, default: true}
},{timestamps: true})
const Car = mongoose.model('Car', carSchema);

async function check() {
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
    let user = await User.findOne({email: 'charaniamgreat@gmail.com'});
    
    if (!user) {
        console.log('User not found, creating user...');
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash('fleet123', 10);
        user = await User.create({
            name: 'Charani',
            email: 'charaniamgreat@gmail.com',
            password: hashedPassword,
            role: 'owner'
        });
        console.log('User created:', user._id);
    } else {
        console.log('User found:', user._id);
        if (user.role !== 'owner') {
            user.role = 'owner';
            await user.save();
        }
    }

    if (user) {
        // delete previous inserted cars that I might have added with wrong owner
        const del = await Car.deleteMany({});
        console.log('Deleted previous cars', del.deletedCount);
        
        await Car.insertMany([
            {
                owner: user._id,
                brand: 'BMW',
                model: 'M3 Coupe',
                image: '/src/assets/car_image1.png',
                year: 2018,
                category: 'Coupe',
                seating_capacity: 4,
                fuel_type: 'Petrol',
                transmission: 'Automatic',
                pricePerDay: 8000,
                location: 'Hyderabad',
                description: 'The BMW M3 Coupe is an iconic high-performance sports car offering precision handling, dynamic power, and aggressive styling.',
                isAvaliable: true
            },
            {
                owner: user._id,
                brand: 'BMW',
                model: 'M4 Coupe',
                image: '/src/assets/car_image2.png',
                year: 2021,
                category: 'Coupe',
                seating_capacity: 4,
                fuel_type: 'Petrol',
                transmission: 'Automatic',
                pricePerDay: 12000,
                location: 'Hyderabad',
                description: 'The BMW M4 Coupe combines track-ready performance with everyday usability and advanced technology.',
                isAvaliable: true
            },
            {
                owner: user._id,
                brand: 'Tesla',
                model: 'Model 3',
                image: '/src/assets/car_image3.png',
                year: 2024,
                category: 'Electric sedan',
                seating_capacity: 5,
                fuel_type: 'Electric',
                transmission: 'Single-speed',
                pricePerDay: 7000,
                location: 'Hyderabad',
                description: 'The Tesla Model 3 offers incredible electric range, minimalist interior, and cutting-edge autonomous driving features.',
                isAvaliable: true
            },
            {
                owner: user._id,
                brand: 'Chevrolet',
                model: 'Camaro',
                image: '/src/assets/car_image4.png',
                year: 2022,
                category: 'Sports coupe',
                seating_capacity: 4,
                fuel_type: 'Petrol',
                transmission: 'Automatic',
                pricePerDay: 9000,
                location: 'Hyderabad',
                description: 'The Chevrolet Camaro is an iconic American muscle car delivering raw V8 power and aggressive styling.',
                isAvaliable: true
            }
        ]);
        console.log('Cars re-inserted with correct owner');
    }
    process.exit(0);
}
check().catch(console.error);
