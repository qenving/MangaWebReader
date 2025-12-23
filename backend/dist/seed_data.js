"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '.env') });
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    const genres = [
        { name: 'Action', slug: 'action' },
        { name: 'Adventure', slug: 'adventure' },
        { name: 'Fantasy', slug: 'fantasy' },
        { name: 'Romance', slug: 'romance' },
        { name: 'Isekai', slug: 'isekai' },
    ];
    console.log('Creating genres...');
    const genreMap = new Map();
    for (const g of genres) {
        const genre = await prisma.genre.upsert({
            where: { slug: g.slug },
            update: {},
            create: g,
        });
        genreMap.set(g.slug, genre.id);
    }
    console.log('Creating Manga: Solo Leveling...');
    const soloLeveling = await prisma.manga.upsert({
        where: { slug: 'solo-leveling' },
        update: {},
        create: {
            slug: 'solo-leveling',
            titleEn: 'Solo Leveling',
            titleJp: '俺だけレベルアップな件',
            status: 'COMPLETED',
            type: 'MANHWA',
            description: 'In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.',
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Solo_Leveling_Webtoon_cover.png',
            rating: 9.8,
            viewsTotal: 1542000,
            viewsWeekly: 12000,
            genres: {
                create: [
                    { genreId: genreMap.get('action') },
                    { genreId: genreMap.get('fantasy') },
                ],
            },
        },
    });
    console.log('Adding chapters to Solo Leveling...');
    for (let i = 1; i <= 5; i++) {
        await prisma.chapter.upsert({
            where: {
                mangaId_number: {
                    mangaId: soloLeveling.id,
                    number: i
                }
            },
            update: {},
            create: {
                mangaId: soloLeveling.id,
                number: i,
                title: `Chapter ${i}`,
                images: JSON.stringify([
                    { url: 'https://placehold.co/800x1200/png?text=Page+1', width: 800, height: 1200 },
                    { url: 'https://placehold.co/800x1200/png?text=Page+2', width: 800, height: 1200 },
                    { url: 'https://placehold.co/800x1200/png?text=Page+3', width: 800, height: 1200 },
                ]),
                releaseDate: new Date(Date.now() - (5 - i) * 24 * 60 * 60 * 1000),
            },
        });
    }
    console.log('Creating Manga: One Piece...');
    const onePiece = await prisma.manga.upsert({
        where: { slug: 'one-piece' },
        update: {},
        create: {
            slug: 'one-piece',
            titleEn: 'One Piece',
            titleJp: 'ワンピース',
            status: 'ONGOING',
            type: 'MANGA',
            description: 'Gol D. Roger was known as the "Pirate King", the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world.',
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a3/One_Piece%2C_Volume_1.jpg',
            rating: 9.9,
            viewsTotal: 5420000,
            viewsWeekly: 45000,
            genres: {
                create: [
                    { genreId: genreMap.get('action') },
                    { genreId: genreMap.get('adventure') },
                ],
            },
        },
    });
    console.log('Adding chapters to One Piece...');
    for (let i = 1100; i <= 1103; i++) {
        await prisma.chapter.upsert({
            where: {
                mangaId_number: {
                    mangaId: onePiece.id,
                    number: i
                }
            },
            update: {},
            create: {
                mangaId: onePiece.id,
                number: i,
                title: `Chapter ${i}`,
                images: JSON.stringify([
                    { url: 'https://placehold.co/800x1200/png?text=OP+Page+1', width: 800, height: 1200 },
                ]),
            },
        });
    }
    console.log('✅ Seeding complete!');
    console.log(`Created manga: ${soloLeveling.titleEn} and ${onePiece.titleEn}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_data.js.map