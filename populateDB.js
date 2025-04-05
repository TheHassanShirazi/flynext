// populate db with dummy data. use prisma and create users, hotels

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.user.deleteMany({});
await prisma.hotel.deleteMany({});
await prisma.roomType.deleteMany({});
await prisma.booking.deleteMany({});

for (let i = 0; i < 10; i++) {
    console.log(`Creating user ${i + 1}`);
    await prisma.user.create({
        data: {
            firstName: `User ${i + 1}`,
            lastName: `Last ${i + 1}`,
            email: `Email ${i + 1}`,
            location: `Location ${i + 1}`,
            phoneNumber: `Phone ${i + 1}`,
            password: `Password ${i + 1}`
        }
    });
}

const users = await prisma.user.findMany();
const userIds = users.map(user => user.id);

const cities = [
    'New York',
    'Toronto',
    'Tokyo',
    'London',
    'Paris'
];

for (let i = 0; i < 100; i++) {
    console.log(`Creating hotel ${i + 1}`);
    await prisma.hotel.create({
        data: {
            ownerId: userIds[Math.floor(Math.random() * userIds.length)],
            name: `Hotel ${i + 1}`,
            address: `Address ${i + 1}`,
            city: cities[Math.floor(Math.random() * 5)],
            starRating: Math.floor(Math.random() * 5) + 1
        }
    });
}

const hotels = await prisma.hotel.findMany();
const hotelIds = hotels.map(hotel => hotel.id);

for (let i = 0; i < 100; i++) {
    console.log(`Creating room type ${i + 1}`);
    await prisma.roomType.create({
        data: {
            type: `Room Type ${i + 1}`,
            hotelId: hotelIds[Math.floor(Math.random() * hotelIds.length)],
            pricePerNight: Math.floor(Math.random() * 100) + 50,
            totalRooms: Math.floor(Math.random() * 100) + 1,
            amenities: `Amenity ${i + 1}`
        }
    });
}