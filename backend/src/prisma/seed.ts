import { PrismaClient, Role } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            password: adminPassword,
            role: Role.ADMIN,
            isEmailVerified: true
        }
    });

    console.log('✅ Created admin user:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'John Doe',
            password: userPassword,
            role: Role.USER,
            isEmailVerified: true
        }
    });

    console.log('✅ Created regular user:', user.email);

    // Create sample items for the user
    const sampleItems = [
        {
            name: 'Toor Dal',
            category: 'dal',
            brand: 'Fortune',
            quantity: 2.0,
            unit: 'kg',
            minStockLevel: 1.0,
            price: 180.0,
            notes: 'Buy organic variety next time'
        },
        {
            name: 'Basmati Rice',
            category: 'rice',
            brand: 'India Gate',
            quantity: 5.0,
            unit: 'kg',
            minStockLevel: 2.0,
            price: 450.0,
            notes: 'Premium quality'
        },
        {
            name: 'Turmeric Powder',
            category: 'spices',
            brand: 'MDH',
            quantity: 0.2,
            unit: 'kg',
            minStockLevel: 0.1,
            price: 80.0,
            notes: null
        },
        {
            name: 'Coconut Oil',
            category: 'oil',
            brand: 'Parachute',
            quantity: 0.5,
            unit: 'liter',
            minStockLevel: 0.5,
            price: 150.0,
            notes: 'For cooking'
        },
        {
            name: 'Onions',
            category: 'vegetables',
            brand: null,
            quantity: 3.0,
            unit: 'kg',
            minStockLevel: 1.0,
            price: 40.0,
            notes: 'Fresh from local market'
        }
    ];

    const calculateStockLevel = (quantity: number, minStockLevel: number): string => {
        if (quantity === 0) {
            return 'out';
        } else if (quantity <= minStockLevel * 0.5) {
            return 'low';
        } else if (quantity <= minStockLevel) {
            return 'medium';
        } else {
            return 'high';
        }
    };

    const createdItems = [];
    for (const itemData of sampleItems) {
        const stockLevel = calculateStockLevel(itemData.quantity, itemData.minStockLevel);
        const item = await prisma.item.upsert({
            where: {
                // Use name as unique key for upsert - this won't work perfectly but will prevent duplicates in dev
                id: 'placeholder'
            },
            update: {},
            create: {
                ...itemData,
                stockLevel,
                updatedBy: user.name || user.email,
                userId: user.id
            }
        });
        createdItems.push(item);
    }

    console.log('✅ Created sample items for user:', user.email);

    // Create sample stock updates for some items
    if (createdItems.length > 0) {
        const sampleStockUpdates = [
            {
                itemId: createdItems[0].id, // Toor Dal
                oldQuantity: 3.0,
                newQuantity: 2.0,
                notes: 'Used 1kg for cooking this week'
            },
            {
                itemId: createdItems[1].id, // Basmati Rice
                oldQuantity: 7.0,
                newQuantity: 5.0,
                notes: 'Used 2kg for family dinner'
            },
            {
                itemId: createdItems[2].id, // Turmeric Powder
                oldQuantity: 0.5,
                newQuantity: 0.2,
                notes: 'Running low, need to buy more'
            }
        ];

        for (const stockUpdateData of sampleStockUpdates) {
            await prisma.stockUpdate.upsert({
                where: { id: 'placeholder' },
                update: {},
                create: {
                    ...stockUpdateData,
                    updatedBy: user.name || user.email,
                    userId: user.id
                }
            });
        }

        console.log('✅ Created sample stock updates for user:', user.email);
    }
}

main()
    .catch(e => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
