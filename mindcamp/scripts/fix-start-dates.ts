import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProgramStartDates() {
    // Find users without programStartDate
    const users = await prisma.user.findMany({
        where: { programStartDate: null }
    });

    console.log(`Found ${users.length} users without programStartDate`);

    for (const user of users) {
        // Find their first entry
        const firstEntry = await prisma.entry.findFirst({
            where: { userId: user.id },
            orderBy: { entryDate: 'asc' }
        });

        if (firstEntry) {
            await prisma.user.update({
                where: { id: user.id },
                data: { programStartDate: firstEntry.entryDate }
            });
            console.log(`Fixed: ${user.email} → ${firstEntry.entryDate}`);
        } else {
            // No entries, set to today
            await prisma.user.update({
                where: { id: user.id },
                data: { programStartDate: new Date() }
            });
            console.log(`Fixed: ${user.email} → today (no entries)`);
        }
    }

    console.log('Done!');
    await prisma.$disconnect();
}

fixProgramStartDates().catch(console.error);
