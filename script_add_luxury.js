import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ImageKit from "imagekit";
import fs from "fs";
import path from "path";

dotenv.config({ path: './.env' });

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ['owner', 'user'], default: 'user' },
    image: {type: String, default: ''},
},{timestamps: true});
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

var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function run() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
        console.log("Connected to MongoDB.");

        const email = 'godthunderfleet@gmail.com';
        let user = await User.findOne({email: email.toLowerCase()});
        
        if (!user) {
            console.log("User not found: " + email);
            process.exit(1);
        }
        
        if (user.role !== 'owner') {
            console.log("Updating user role to owner...");
            user.role = 'owner';
            await user.save();
        }
        console.log("User found with ID: " + user._id + " and role: " + user.role);

        // Upload images and insert cars
        const carsToAdd = [
            {
                brand: 'Bentley',
                model: 'Continental GT',
                imageFile: 'bentley.jpg',
                category: 'Luxury Coupe',
                fuel_type: 'Petrol',
                transmission: 'Automatic',
                seating_capacity: 4,
                pricePerDay: 45000,
                location: 'Hyderabad',
                description: 'Premium grand touring coupe with an elegant design and luxury-focused interior.',
                year: new Date().getFullYear(), // Placeholder
            },
            {
                brand: 'Rolls-Royce',
                model: 'Ghost',
                imageFile: 'royce.jpg',
                category: 'Ultra-Luxury Sedan',
                fuel_type: 'Petrol',
                transmission: 'Automatic',
                seating_capacity: 5,
                pricePerDay: 75000,
                location: 'Hyderabad',
                description: 'Ultra-luxury sedan offering a spacious cabin, refined comfort, and premium chauffeur-style travel appeal.',
                year: new Date().getFullYear(),
            },
            {
                brand: 'Land Rover',
                model: 'Range Rover',
                imageFile: 'rr.jpg',
                category: 'Luxury SUV',
                fuel_type: 'Unverified',
                transmission: 'Automatic',
                seating_capacity: 5,
                pricePerDay: 35000,
                location: 'Hyderabad',
                description: 'Full-size luxury SUV designed for premium travel, comfort, and versatile road use.',
                year: new Date().getFullYear(),
            }
        ];

        for (const c of carsToAdd) {
            const existingCar = await Car.findOne({ owner: user._id, model: c.model });
            if (existingCar) {
                console.log(`Car ${c.model} already exists. Skipping.`);
                continue;
            }

            console.log(`Uploading ${c.imageFile} to ImageKit...`);
            const filePath = path.join('d:/projects/CarRental-fullstack/client/src/assets', c.imageFile);
            const fileData = fs.readFileSync(filePath);

            const uploadResponse = await imagekit.upload({
                file: fileData,
                fileName: c.imageFile,
            });

            console.log(`Uploaded! URL: ${uploadResponse.url}`);

            await Car.create({
                owner: user._id,
                brand: c.brand,
                model: c.model,
                image: uploadResponse.url,
                year: c.year,
                category: c.category,
                seating_capacity: c.seating_capacity,
                fuel_type: c.fuel_type,
                transmission: c.transmission,
                pricePerDay: c.pricePerDay,
                location: c.location,
                description: c.description,
                isAvaliable: true
            });
            console.log(`Inserted car: ${c.model}`);
        }

        console.log("Done.");
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
