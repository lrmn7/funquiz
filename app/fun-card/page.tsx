"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import IDCard from "@/components/ui/IDCard";
import { FaCoins, FaXTwitter } from "react-icons/fa6";
import { toast, Id as ToastId } from "react-toastify";
import { useFunCardContract } from "@/hooks/useFunCardContract";
import { formatEther } from "viem";

const FunCardPage = () => {
    const [details, setDetails] = useState({
        name: "",
        residence: "",
        somniaRank: "",
        somniaRoles: "",
        favGame: "",
        kaitoRank: "",
    });
    const [profilePic, setProfilePic] = useState<string>("");
    const cardRef = useRef<HTMLDivElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [idCardReady, setIdCardReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mintToastId, setMintToastId] = useState<ToastId | null>(null);

    const { safeMint, mintFee, isPending, isConfirming, isConfirmed, receipt, error } = useFunCardContract();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const checkCardStatus = async () => {
            if (!cardRef.current) {
                setTimeout(checkCardStatus, 50);
                return;
            }

            const images = cardRef.current.querySelectorAll("img");
            const imageLoadPromises = Array.from(images).map((img) => {
                return new Promise<void>((resolve) => {
                    if (img.complete && img.naturalHeight !== 0) {
                        return resolve();
                    }
                    const timer = setTimeout(() => {
                        console.warn(`html-to-image DEBUG: Image ${img.src} timed out loading.`);
                        resolve();
                    }, 5000);
                    img.onload = () => {
                        clearTimeout(timer);
                        resolve();
                    };
                    img.onerror = () => {
                        clearTimeout(timer);
                        resolve();
                    };
                });
            });

            try {
                await Promise.all(imageLoadPromises);
            } catch (err) {
                console.error("Failed to await assets:", err);
            } finally {
                await new Promise((resolve) => setTimeout(resolve, 300));
                setIdCardReady(true);
            }
        };

        const initialTimer = setTimeout(checkCardStatus, 100);
        return () => clearTimeout(initialTimer);
    }, [details, profilePic]);
    
    useEffect(() => {
        if (mintToastId) {
            if (isConfirmed && receipt) {
                toast.update(mintToastId, {
                    render: "NFT successfully minted!",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                });
                setMintToastId(null);
            }
            if (error) {
                const errorMessage = (error as any).shortMessage || error.message;
                toast.update(mintToastId, {
                    render: `Minting failed: ${errorMessage}`,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                });
                setMintToastId(null);
            }
        }
    }, [isConfirmed, receipt, error, mintToastId]);
    
    useEffect(() => {
        if (!isPending && !isConfirming) {
            setIsProcessing(false);
        }
    }, [isPending, isConfirming]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
        setIdCardReady(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePic(event.target?.result as string);
                setIdCardReady(false);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleMint = async () => {
        if (!cardRef.current || !idCardReady) {
            toast.warn("Card is not ready yet. Please wait.");
            return;
        }
        if (!details.name.trim()) {
            toast.error("Name is a required field.");
            return;
        }
        if (mintFee === undefined) {
            toast.error("Could not fetch minting fee. Please refresh.");
            return;
        }

        setIsProcessing(true);
        const id = toast.loading("1/3 - Generating card image...");
        setMintToastId(id);

        try {
            const dataUrl = await toPng(cardRef.current, {
                backgroundColor: "#1e293b",
                cacheBust: true,
                pixelRatio: 2,
            });
            toast.update(id, { render: "2/3 - Uploading to IPFS..." });

            const response = await fetch('/api/upload-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: dataUrl, cardDetails: details }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload to IPFS');
            }

            const { metadataUrl } = await response.json();
            toast.update(id, { render: "3/3 - Please confirm in wallet..." });

            safeMint(metadataUrl, mintFee as bigint);
            
        } catch (err: any) {
            console.error("Minting failed:", err);
            if (mintToastId) {
                toast.update(mintToastId, { render: `Minting failed: ${err.message}`, type: "error", isLoading: false, autoClose: 5000 });
            } else {
                toast.error(`Minting failed: ${err.message}`);
            }
            setIsProcessing(false);
        }
    };

    const handleShare = () => {
        const text = `Build the Quiz. Break the Minds. 🧠💥\nthat’s what i just did on #FunQuiz a wild quiz dApp built on @Somnia_Network\n\nready to challenge the world with your own quiz?\ncreate yours 👉 https://fun-quiz.fun/create-quiz\nget your ID 👉 https://fun-quiz.fun/fun-card\n\n#SomniaCreator`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank");
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-8 text-center">
                Somnia Community ID Card
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="bg-surface p-6 md:p-8 rounded-lg border border-border space-y-4">
                    <Input label="Name" name="name" value={details.name} onChange={handleInputChange} placeholder="Your Name" />
                    <Input label="Residence" name="residence" value={details.residence} onChange={handleInputChange} placeholder="e.g., Indonesia" />
                    <Input label="Somnia Rank" name="somniaRank" value={details.somniaRank} onChange={handleInputChange} placeholder="e.g., 69" />
                    <Input label="Somnia Roles" name="somniaRoles" value={details.somniaRoles} onChange={handleInputChange} placeholder="e.g., OGSomniac" />
                    <Input label="Favorite Somnia Game" name="favGame" value={details.favGame} onChange={handleInputChange} placeholder="e.g., Chunked" />
                    <Input label="Kaito 7D Rank" name="kaitoRank" value={details.kaitoRank} onChange={handleInputChange} placeholder="e.g., 69" />
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    {isMobile && (
                        <div className="relative w-full max-w-[350px]">
                            <img src="/sample.png" alt="Sample ID Card Preview" className="w-full rounded-lg border border-border" />
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                                <span className="select-none text-5xl font-bold text-white tracking-widest opacity-75">SAMPLE</span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={cardRef} className={isMobile ? "absolute -left-[9999px]" : ""}>
                        <IDCard
                            key={JSON.stringify(details) + profilePic}
                            {...details}
                            profilePic={profilePic}
                        />
                    </div>

                    <div className="w-full max-w-[350px] space-y-3">
                        <Button
                            onClick={handleMint}
                            isLoading={isProcessing || !idCardReady}
                            className="w-full text-lg"
                            disabled={!idCardReady || isProcessing}
                        >
                            <FaCoins className="mr-2" />
                            {isPending ? "Check Wallet..." : isConfirming ? "Minting NFT..." : idCardReady ? `Mint NFT (${mintFee !== undefined ? formatEther(mintFee as bigint) : '...'} STT)` : "Loading Card..."}
                        </Button>
                        <Button onClick={handleShare} className="w-full text-lg bg-gray-600 hover:bg-gray-700">
                            <FaXTwitter className="mr-2" /> Share to X (Twitter)
                        </Button>
                        <p className="text-xs text-center text-secondary">
                            Mint your card first, then share it with the world!
                            <br />
                            <span className="text-[10px] opacity-80">
                                If minting fails, please try using a desktop browser.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunCardPage;