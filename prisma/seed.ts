import "dotenv/config";

import { pool, prisma } from "../src/lib/prismaInstance.js";

async function main() {
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: { name: "Alice" },
    create: { email: "alice@prisma.io", name: "Alice" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
