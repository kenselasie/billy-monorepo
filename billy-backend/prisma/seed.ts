import { PrismaClient } from '@prisma/client';
import { seedUserRoles } from './seed_data/userrole_seed';
import { seedAttributes } from './seed_data/attributes_seed';
import { seedSampleUsers } from './seed_data/user_seed';

const prisma = new PrismaClient();

async function main() {
  seedUserRoles();
  seedAttributes();
  seedSampleUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
