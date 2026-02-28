
import { db } from '../src/lib/db';
import { users } from '../src/db/schema';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🌱 Seeding Admin User...\n');

    const email = 'admin@zegarra.com';
    const password = 'admin123';

    // Check if exists
    const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existing) {
        // Update password if exists (in case password column was added after initial seed)
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.update(users)
            .set({ password: hashedPassword, role: 'admin' })
            .where(eq(users.email, email));
        console.log('✅ Admin password updated.');
    } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.insert(users).values({
            name: 'Admin Zegarra',
            email: email,
            password: hashedPassword,
            role: 'admin',
            image: 'https://ui-avatars.com/api/?name=Admin+Zegarra',
        });
        console.log('✅ Admin user created.');
    }

    console.log('\n📧 Email:    admin@zegarra.com');
    console.log('🔑 Password: admin123');
}

main().then(() => process.exit(0)).catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
});
