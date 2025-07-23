'use client'; 

import Image from 'next/image'; 

interface IDCardProps {
    name: string;
    residence: string;
    somniaRank: string;
    somniaRoles: string;
    favGame: string;
    kaitoRank: string;
    profilePic: string;
}

const IDCard = ({ name, residence, somniaRank, favGame, somniaRoles, kaitoRank, profilePic }: IDCardProps) => {
    const colors = {
        primary: "#FFA500",
        primaryHover: "#FFC14D",
        secondary: "#A0AEC0",
        accent: "#F2AC29", 
        accentHover: "#e29c20",
        border: "#2D3748",
        surface: "#1E1E1E", 
        slate700: "#475569",
        slate800: "#1e293b", 
        slate900: "#0f172a",
        cyan400: "#22d3ee",
        pink500: "#ec4899",
        shadowBlack10: "rgba(0,0,0,0.1)",
        shadowBlack20: "rgba(0,0,0,0.2)",
        shadowBlack30: "rgba(0,0,0,0.3)",
        shadowCyan500_20: "rgba(6, 182, 212, 0.2)", 
    };
    const darkenColor = (hex: string, percent: number) => {
        let f = parseInt(hex.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = (f >> 8) & 0x00ff,
            B = f & 0x0000ff;
        return (
            "#" +
            (
                0x1000000 +
                (Math.round((t - R) * p) + R) * 0x10000 +
                (Math.round((t - G) * p) + G) * 0x100 +
                (Math.round((t - B) * p) + B)
            )
            .toString(16)
            .slice(1)
        );
    };

    const primaryDarker = darkenColor(colors.primary, 0.3);
    const primaryDarkest = darkenColor(colors.primary, 0.5);

    const refinedSharp3DTextStyle = {
        color: colors.primary,
        textShadow: `
            1px 1px ${primaryDarker},
            2px 2px ${primaryDarkest},
            3px 3px 4px ${colors.shadowBlack30}
        `
    };

    const imageEffectStyle = {
        boxShadow: `
            1px 1px 2px ${colors.slate800},    
            -1px -1px 2px ${colors.slate800},   
            0 0 5px ${colors.slate800},
            0 0 10px ${colors.slate800}
        `,
        filter: `drop-shadow(0px 0px 3px ${colors.slate800})`
    };

    return (
        <div className="w-[600px] h-[410px] relative" style={{ backgroundColor: colors.slate800 }}> 
            <div className="relative w-full h-full">
                <div 
                    className="absolute bottom-0 left-[2%] w-[96%] h-[90%] rounded-2xl shadow-2xl" 
                    style={{ 
                        background: `linear-gradient(to bottom right, ${colors.slate700}, ${colors.slate800})`,
                        boxShadow: `0 25px 50px -12px ${colors.shadowBlack30}` 
                    }}
                ></div>

                {/* Header gradien biru-pink */}
                <div 
                    className="absolute top-0 left-0 w-full h-[70px] rounded-t-2xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
                    }}
                >
                    <h1 
                        className="font-orbitron text-3xl font-bold tracking-widest" 
                        style={{ 
                            background: `linear-gradient(to right, ${colors.cyan400}, ${colors.pink500})`,
                            WebkitBackgroundClip: 'text', 
                            backgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent', 
                            color: 'transparent',
                            textShadow: `0 2px 4px ${colors.shadowBlack20}`
                        }}
                    > 
                        SOMNIA ID CARD
                    </h1>
                </div>

                <div className="absolute bottom-8 right-8 z-30">
                    <Image src="/funquiz.png" alt="FunQuiz Logo" width={42} height={42} crossOrigin="anonymous" />
                </div>


                {/* --- Bagian Konten Utama --- */}
                <div className="absolute top-[80px] left-0 w-full h-auto px-8 flex gap-6">
                    {/* Kolom Kiri: Foto */}
                    <div className="w-2/5 flex flex-col items-center mt-8"> 
                        <div 
                            className="p-[3px] rounded-lg"
                            style={{ 
                                width: '192px', 
                                height: '224px',
                                background: `linear-gradient(to bottom right, ${colors.slate700}, ${colors.slate700})`,
                                ...imageEffectStyle
                            }}
                        >
                            <div className="w-full h-full rounded-lg" style={{ backgroundColor: colors.slate900 }}>
                                <Image
                                    src={profilePic || '/default-avatar.png'}
                                    alt="Profile Picture"
                                    width={192} 
                                    height={224} 
                                    className="rounded-md object-cover w-full h-full"
                                    crossOrigin="anonymous" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Stats & Nama */}
                    <div className="w-3/5 flex flex-col justify-center text-left pt-4">
                        <h2 
                            className="font-orbitron text-3xl font-bold text-center mb-6 truncate" 
                            style={refinedSharp3DTextStyle} 
                        > 
                            {name || 'YOUR NAME'}
                        </h2>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 pb-4"> 
                            <div>
                                <p className="text-sm font-semibold" style={{ color: colors.secondary }}>Residence</p>
                                <p className="text-xl font-bold truncate" style={refinedSharp3DTextStyle}>{residence || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: colors.secondary }}>Somnia Rank</p>
                                <p className="text-xl font-bold truncate" style={refinedSharp3DTextStyle}>
                                    {somniaRank ? `#${somniaRank}` : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: colors.secondary }}>Somnia Roles</p>
                                <p className="text-xl font-bold truncate" style={refinedSharp3DTextStyle}>{somniaRoles || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: colors.secondary }}>Fav Somnia Game</p>
                                <p className="text-xl font-bold truncate" style={refinedSharp3DTextStyle}>{favGame || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: colors.secondary }}>Kaito 7D Rank</p>
                                <p className="text-xl font-bold truncate" style={refinedSharp3DTextStyle}>
                                    {kaitoRank ? `#${kaitoRank}` : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDCard;