'use client'; 

import Image from 'next/image'; // Anda bisa kembali menggunakan Next/Image atau tetap img native

interface IDCardProps {
    name: string;
    residence: string;
    somniaRank: string;
    favGame: string;
    rubyScore: string;
    kaitoRank: string;
    profilePic: string;
}

const IDCard = ({ name, residence, somniaRank, favGame, rubyScore, kaitoRank, profilePic }: IDCardProps) => {
    return (
        // Kembalikan ke desain yang menarik
        <div className="w-[600px] h-[410px] relative"> {/* Sesuaikan tinggi jika perlu */}
            {/* Wrapper untuk semua elemen kartu */}
            <div className="relative w-full h-full">

                {/* Bagian 1: Latar belakang utama kartu (abu-abu metalik) */}
                <div className="absolute bottom-0 left-[2%] w-[96%] h-[90%] bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl"></div>

                {/* Bagian 2: Header gradien biru-pink */}
                <div className="absolute top-0 left-0 w-full h-[70px] bg-gradient-to-r from-cyan-400 to-pink-500 rounded-t-2xl flex items-center justify-center">
                    <h1 className="font-orbitron text-3xl font-bold text-white tracking-widest text-shadow-md">
                        SOMNIA ID CARD
                    </h1>
                </div>

                {/* Bagian 3: Logo bulat di atas header */}
                <div className="absolute top-[-15px] left-8 w-[100px] h-[100px] bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center p-1">
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                        {/* Pilih: Image dari Next/Image atau img native */}
                        <Image src="/funquiz.png" alt="Somnia Logo" width={60} height={60} crossOrigin="anonymous" /> 
                        {/* <img src="/funquiz.png" alt="Somnia Logo" width={60} height={60} crossOrigin="anonymous" /> */}
                    </div>
                </div>

                {/* Bagian 4: Konten utama (Foto & Detail) */}
                <div className="absolute top-[80px] left-0 w-full h-auto px-8 flex gap-6">
                    {/* Kolom Kiri: Foto & Nama */}
                    <div className="w-2/5 flex flex-col items-center">
                        <div className="w-48 h-56 rounded-lg bg-slate-900 border-2 border-cyan-400 p-2 shadow-lg shadow-cyan-500/20">
                            {/* Pilih: Image dari Next/Image atau img native */}
                            <Image
                                src={profilePic || '/default-avatar.png'}
                                alt="Profile Picture"
                                width={192} 
                                height={224} 
                                className="rounded-md object-cover w-full h-full"
                                crossOrigin="anonymous" // Penting untuk CORS jika gambar dari luar domain
                            />
                            {/* <img src={profilePic || '/default-avatar.png'} alt="Profile Picture" width={192} height={224} className="rounded-md object-cover w-full h-full" crossOrigin="anonymous" /> */}
                        </div>
                        <h2 className="font-orbitron text-2xl font-bold text-cyan-300 mt-2 text-shadow-sm">
                            {name || 'YOUR NAME'}
                        </h2>
                    </div>

                    {/* Kolom Kanan: Stats */}
                    <div className="w-3/5 flex flex-col justify-center text-left pt-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 pb-4"> 
                            <div>
                                <p className="text-sm text-secondary font-semibold">Somnia Rank</p>
                                <p className="text-xl font-bold text-white truncate">{somniaRank || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary font-semibold">Ruby Score</p>
                                <p className="text-xl font-bold text-white truncate">{rubyScore || '0'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary font-semibold">Fav Somnia Game</p>
                                <p className="text-xl font-bold text-white truncate">{favGame || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary font-semibold">Kaito 7D Rank</p>
                                <p className="text-xl font-bold text-white truncate">{kaitoRank || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary font-semibold">Residence</p>
                                <p className="text-xl font-bold text-white truncate">{residence || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bagian 5: Footer Dekoratif */}
                <div className="absolute bottom-4 left-[5%] w-[90%] h-8 bg-slate-900/50 rounded-lg flex items-center justify-center px-4">
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default IDCard;