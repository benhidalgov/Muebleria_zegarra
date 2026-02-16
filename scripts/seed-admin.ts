
import { db } from '../src/lib/db';
import { users } from '../src/db/schema';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🌱 Seeding Admin User...');

    const email = 'admin@zegarra.com';

    // Check if exists
    const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existing) {
        console.log('Admin already exists.');
        return;
    }

    await db.insert(users).values({
        name: 'Admin Zegarra',
        email: email,
        role: 'admin',
        image: 'https://ui-avatars.com/api/?name=Admin+Zegarra',
    });

    console.log('✅ Admin user created: admin@zegarra.com');
    console.log('🔑 Password: (Any password works in this demo mode)');
}

main().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
});
