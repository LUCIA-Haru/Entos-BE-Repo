/**
 * Optional minimal seed — two Yangon cafés so list endpoints have something to show later.
 * Run: pnpm db:seed  (from repo root, after migrate)
 */
import { PrismaClient, CafeStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const quiet = await prisma.tag.upsert({
    where: { slug: 'quiet' },
    update: {},
    create: { name: 'Quiet', slug: 'quiet' },
  });

  const specialty = await prisma.tag.upsert({
    where: { slug: 'specialty' },
    update: {},
    create: { name: 'Specialty', slug: 'specialty' },
  });

  const laptop = await prisma.tag.upsert({
    where: { slug: 'laptop-friendly' },
    update: {},
    create: { name: 'Laptop-friendly', slug: 'laptop-friendly' },
  });

  const rangoon = await prisma.cafe.upsert({
    where: { slug: 'rangoon-tea-house' },
    update: {},
    create: {
      name: 'Rangoon Tea House',
      slug: 'rangoon-tea-house',
      status: CafeStatus.PUBLISHED,
      shortDescription: 'Modern Myanmar tea & café culture in downtown Yangon.',
      description:
        'A well-known Yangon spot for tea-leaf salad, coffee, and a lively dining room.',
      city: 'Yangon',
      township: 'Kyauktada',
      address: '77-91 Pansodan Street',
      country: 'MM',
      timezone: 'Asia/Yangon',
      menuItems: {
        create: [
          {
            name: 'Espresso',
            category: 'Coffee',
            priceMinor: 3500,
            currency: 'MMK',
            sortOrder: 1,
          },
          {
            name: 'Lahpet thoke',
            category: 'Food',
            priceMinor: 8000,
            currency: 'MMK',
            sortOrder: 2,
          },
        ],
      },
      hours: {
        create: Array.from({ length: 7 }, (_, dayOfWeek) => ({
          dayOfWeek,
          openTime: '09:00',
          closeTime: '21:00',
          isClosed: false,
        })),
      },
      tags: {
        create: [{ tagId: specialty.id }, { tagId: laptop.id }],
      },
    },
  });

  const commonGround = await prisma.cafe.upsert({
    where: { slug: 'common-ground-yangon' },
    update: {},
    create: {
      name: 'Common Ground Coffee',
      slug: 'common-ground-yangon',
      status: CafeStatus.PUBLISHED,
      shortDescription: 'Specialty coffee and a calm corner to work.',
      city: 'Yangon',
      township: 'Bahan',
      country: 'MM',
      timezone: 'Asia/Yangon',
      menuItems: {
        create: [
          {
            name: 'Flat white',
            category: 'Coffee',
            priceMinor: 4500,
            currency: 'MMK',
            sortOrder: 1,
          },
        ],
      },
      hours: {
        create: Array.from({ length: 7 }, (_, dayOfWeek) => ({
          dayOfWeek,
          openTime: dayOfWeek === 0 ? '10:00' : '08:00',
          closeTime: '18:00',
          isClosed: false,
        })),
      },
      tags: {
        create: [{ tagId: quiet.id }, { tagId: specialty.id }, { tagId: laptop.id }],
      },
    },
  });

  console.log('Seeded cafés:', rangoon.slug, commonGround.slug);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
