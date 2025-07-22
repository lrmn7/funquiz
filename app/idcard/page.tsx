'use client';

import { useState, useRef } from 'react'; // useRef tidak lagi digunakan untuk html2canvas
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
// import IDCard from '@/components/ui/IDCard'; // IDCard tidak lagi dirender untuk capture di frontend
import { FaDownload, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify'; 

// Import komponen IDCard asli Anda untuk tampilan di browser
import IDCardVisual from '@/components/ui/IDCard'; 


const IDCardPage = () => {
    const [details, setDetails] = useState({
        name: '',
        residence: '',
        somniaRank: '',
        favGame: '',
        rubyScore: '',
        kaitoRank: '',
    });
    const [profilePic, setProfilePic] = useState<string>('');
    // cardRef tidak lagi diperlukan untuk capture, hanya untuk tampilan visual
    const cardRefVisual = useRef<HTMLDivElement>(null); 
    const [isDownloading, setIsDownloading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePic(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // =================================================================
    // Fungsi download yang baru: Memanggil API Route
    // =================================================================
    const handleDownload = async () => {
        setIsDownloading(true);
        toast.info("Generating ID Card image on server...", { autoClose: 5000 });

        try {
            const response = await fetch('/api/generate-id-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ details, profilePic }), // Kirim data detail dan profilePic (data URL)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            // Dapatkan nama file dari header Content-Disposition
            let filename = `FunQuiz_Somnia_ID_Card_${details.name.replace(/\s+/g, '_') || 'user'}.png`;
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                const match = /filename="([^"]+)"/.exec(contentDisposition);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
            
            // Dapatkan blob gambar dari respons
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            // Buat link download dan klik
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = filename;
            document.body.appendChild(link); // Penting untuk Firefox
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(imageUrl); // Bersihkan URL objek

            toast.success("ID Card downloaded successfully!", { autoClose: 2000 });

        } catch (err: any) {
            console.error("Failed to generate image:", err);
            toast.error(`Oops! Something went wrong: ${err.message || 'Unknown error'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = () => {
        const text = `Check out my official #SomniaNetwork ID card from #FunQuiz! 🚀\n\nJoin the Somnia ecosystem, create your own card, and let's connect! #Web3 #Gaming`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-8 text-center">Somnia Community ID Card</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                <div className="bg-surface p-6 md:p-8 rounded-lg border border-border space-y-4">
                    <Input label="Name" name="name" value={details.name} onChange={handleInputChange} placeholder="Your Name" />
                    <Input label="Residence" name="residence" value={details.residence} onChange={handleInputChange} placeholder="City, Country" />
                    <Input label="Somnia Rank" name="somniaRank" value={details.somniaRank} onChange={handleInputChange} placeholder="e.g., Dreamer" />
                    <Input label="Favorite Somnia Game" name="favGame" value={details.favGame} onChange={handleInputChange} placeholder="e.g., SOMRI" />
                    <Input label="RubyScore" name="rubyScore" value={details.rubyScore} onChange={handleInputChange} placeholder="e.g., 1500" />
                    <Input label="Kaito 7D Rank" name="kaitoRank" value={details.kaitoRank} onChange={handleInputChange} placeholder="e.g., Top 10%" />
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
                    {/* Menggunakan komponen visual IDCard yang menarik */}
                    <div ref={cardRefVisual}>
                        <IDCardVisual 
                            {...details} 
                            profilePic={profilePic} 
                        />
                    </div>
                    <div className="w-full max-w-[350px] space-y-3">
                       <Button onClick={handleDownload} isLoading={isDownloading} className="w-full text-lg">
                            <FaDownload className="mr-2" /> 
                            {isDownloading ? "Generating..." : "Download Card"}
                       </Button>
                       <Button onClick={handleShare} className="w-full text-lg bg-gray-600 hover:bg-gray-700">
                            <FaTwitter className="mr-2" /> Share to Twitter
                       </Button>
                       <p className="text-xs text-center text-secondary">Download card first, then attach it to your tweet!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDCardPage;