// app/api/generate-id-card/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Fungsi untuk membuat HTML string dari data ID Card
// Ini akan berisi styling lengkap ID Card Anda
const generateIdCardHtml = (details: any, profilePicDataUrl: string) => {
    // Pastikan font Orbitron dimuat dengan @import
    // Sesuaikan path ke font atau gunakan URL Google Fonts jika tidak disimpan lokal
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Somnia ID Card</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        <style>
            /* Reset CSS */
            body { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; }

            /* Definisi kelas Tailwind secara manual atau import Tailwind CSS di sini */
            /* Ini adalah bagian KRUSIAL: replikasi styling IDCard.tsx Anda */
            .font-orbitron { font-family: 'Orbitron', sans-serif; }
            .text-shadow-md { text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            .text-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
            .text-primary { color: #FFA500; } /* Contoh, sesuaikan dengan tailwind.config.ts Anda */
            .text-secondary { color: #A0AEC0; }
            .bg-slate-800 { background-color: #1e293b; }
            .bg-slate-900 { background-color: #0f172a; } /* Contoh, sesuaikan */
            .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
            .from-cyan-400 { --tw-gradient-from: #22d3ee; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(34, 211, 238, 0)); }
            .to-pink-500 { --tw-gradient-to: #ec4899; }
            .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
            .from-slate-700 { --tw-gradient-from: #475569; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(71, 85, 105, 0)); }
            .border-cyan-400 { border-color: #22d3ee; }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
            .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
            .shadow-cyan-500\/20 { box-shadow: 0 25px 50px -12px rgba(6, 182, 212, 0.2); } /* Contoh, sesuaikan */
            .object-cover { object-fit: cover; }
            .rounded-md { border-radius: 0.375rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-full { border-radius: 9999px; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

            /* Styling Utama Kartu */
            .id-card-container {
                width: 600px;
                height: 410px; /* Sesuaikan tinggi sesuai kebutuhan */
                position: relative;
                background-color: #1e293b; /* bg-slate-800 */
                border-radius: 1rem; /* rounded-2xl */
                padding: 1rem; /* p-4 */
                overflow: hidden; /* Penting untuk clipping */
                box-sizing: border-box; /* Pastikan padding dihitung dalam width/height */
            }

            .header-gradient {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 70px;
                background: linear-gradient(to right, #22d3ee, #ec4899); /* from-cyan-400 to-pink-500 */
                border-top-left-radius: 1rem; /* rounded-t-2xl */
                border-top-right-radius: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                margin-left: -1rem; /* -mx-4 (p-4) */
                margin-top: -1rem; /* -mt-4 (p-4) */
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            .logo-circle {
                position: absolute;
                top: -15px; /* Sesuaikan posisi ini */
                left: 32px; /* Sesuaikan posisi ini (left-8 dengan p-4) */
                width: 100px;
                height: 100px;
                background: linear-gradient(to bottom right, #475569, #1e293b); /* from-slate-700 to-slate-800 */
                border-radius: 9999px; /* rounded-full */
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px; /* p-1 */
                z-index: 20;
            }
            .logo-inner {
                width: 100%;
                height: 100%;
                background-color: #0f172a; /* bg-slate-900 */
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .main-content {
                margin-top: 60px; /* mt-[60px] */
                padding-left: 1rem; /* px-4 */
                padding-right: 1rem; /* px-4 */
                display: flex;
                gap: 1.5rem; /* gap-6 */
                position: relative;
                z-index: 10;
            }

            .profile-section {
                width: 40%; /* w-2/5 */
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .profile-pic-frame {
                width: 192px; /* w-48 */
                height: 224px; /* h-56 */
                border-radius: 0.5rem; /* rounded-lg */
                background-color: #0f172a; /* bg-slate-900 */
                border: 2px solid #22d3ee; /* border-2 border-cyan-400 */
                padding: 8px; /* p-2 */
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05), 0 25px 50px -12px rgba(6, 182, 212, 0.2); /* shadow-lg shadow-cyan-500/20 */
                overflow: hidden; /* ensure image stays within frame */
            }
            .profile-pic-frame img {
                width: 100%;
                height: 100%;
                border-radius: 0.375rem; /* rounded-md */
                object-fit: cover;
            }
            .profile-name {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem; /* text-2xl */
                font-weight: bold;
                color: #67e8f9; /* text-cyan-300 */
                margin-top: 0.5rem; /* mt-2 */
                text-shadow: 0 1px 2px rgba(0,0,0,0.1); /* text-shadow-sm */
            }

            .stats-section {
                width: 60%; /* w-3/5 */
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: left;
                padding-top: 1rem; /* pt-4 */
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 1.5rem; /* gap-x-6 gap-y-3 */
                padding-bottom: 2rem; /* pb-8 */
            }
            .stat-label {
                font-size: 0.875rem; /* text-sm */
                color: #A0AEC0; /* text-secondary */
                font-weight: 600; /* font-semibold */
            }
            .stat-value {
                font-size: 1.25rem; /* text-xl */
                font-weight: bold;
                color: white;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .footer-decorative {
                position: absolute;
                bottom: 1rem; /* bottom-4 */
                left: 5%;
                width: 90%;
                height: 2rem; /* h-8 */
                background-color: rgba(15, 23, 42, 0.5); /* bg-slate-900/50 */
                border-radius: 0.5rem; /* rounded-lg */
                display: flex;
                align-items: center;
                justify-content: center;
                padding-left: 1rem; /* px-4 */
                padding-right: 1rem; /* px-4 */
                z-index: 10;
            }
            .footer-line {
                width: 100%;
                height: 2px;
                background: linear-gradient(to right, transparent, #22d3ee, transparent); /* from-transparent via-cyan-400 to-transparent */
            }
        </style>
    </head>
    <body>
        <div class="id-card-container">
            <div class="header-gradient">
                <h1 class="font-orbitron text-3xl font-bold text-white tracking-widest text-shadow-md">
                    SOMNIA ID CARD
                </h1>
            </div>
            <div class="logo-circle">
                <div class="logo-inner">
                    <img src="/funquiz.png" alt="Somnia Logo" width="60" height="60" />
                </div>
            </div>
            <div class="main-content">
                <div class="profile-section">
                    <div class="profile-pic-frame">
                        <img src="${profilePicDataUrl || '/default-avatar.png'}" alt="Profile Picture" width="192" height="224" />
                    </div>
                    <h2 class="profile-name">
                        ${details.name || 'YOUR NAME'}
                    </h2>
                </div>
                <div class="stats-section">
                    <div class="stats-grid">
                        <div>
                            <p class="stat-label">Somnia Rank</p>
                            <p class="stat-value">${details.somniaRank || '-'}</p>
                        </div>
                        <div>
                            <p class="stat-label">Ruby Score</p>
                            <p class="stat-value">${details.rubyScore || '0'}</p>
                        </div>
                        <div>
                            <p class="stat-label">Fav Somnia Game</p>
                            <p class="stat-value">${details.favGame || '-'}</p>
                        </div>
                        <div>
                            <p class="stat-label">Kaito 7D Rank</p>
                            <p class="stat-value">${details.kaitoRank || '-'}</p>
                        </div>
                        <div>
                            <p class="stat-label">Residence</p>
                            <p class="stat-value">${details.residence || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-decorative">
                <div class="footer-line"></div>
            </div>
        </div>
    </body>
    </html>
    `;
};


export async function POST(req: NextRequest) {
    try {
        const { details, profilePic } = await req.json();

        // Validasi data yang diterima
        if (!details) {
            return NextResponse.json({ error: 'Missing details data' }, { status: 400 });
        }

        // Luncurkan browser headless
        const browser = await puppeteer.launch({ 
            headless: true, // true untuk produksi, 'new' atau false untuk debugging visual
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Penting untuk lingkungan server (misal Vercel, Docker)
        });
        const page = await browser.newPage();

        // Set viewport yang lebih besar untuk mencegah pemotongan
        await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 }); // Tingkatkan viewport dan deviceScaleFactor untuk hasil lebih tajam

        // Buat HTML string dari data yang diterima
        const htmlContent = generateIdCardHtml(details, profilePic);
        
        // Muat konten HTML ke dalam halaman Puppeteer
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0', // Tunggu sampai tidak ada permintaan jaringan selama 500ms
        });

        // =================================================================
        // Ambil screenshot dari elemen ID Card itu sendiri
        // =================================================================
        const idCardElement = await page.$('.id-card-container'); // Selector ke root div ID Card
        let imageBuffer: Buffer;

        if (idCardElement) {
imageBuffer = Buffer.from(await page.screenshot({ type: 'png', fullPage: true }));
        } else {
            // Fallback: Jika elemen tidak ditemukan, ambil screenshot seluruh halaman
            console.warn("Puppeteer: .id-card-container not found, taking full page screenshot.");
imageBuffer = Buffer.from(await page.screenshot({ type: 'png', fullPage: true }));
        }
        
        await browser.close();

        // Kirim gambar sebagai respons
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="FunQuiz_Somnia_ID_Card_${details.name.replace(/\s+/g, '_') || 'user'}.png"`,
            },
        });

    } catch (error) {
        console.error('Failed to generate ID card image:', error);
        return NextResponse.json({ error: 'Failed to generate ID card image.' }, { status: 500 });
    }
}

// Untuk Pages Router, Anda akan menggunakan module.exports = async (req, res) => { ... }
// export default async function handler(req: NextApiRequest, res: NextApiResponse) { /* ... sama seperti di atas */ }