"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import IDCard from "@/components/ui/IDCard";
import { FaDownload, FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [idCardReady, setIdCardReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile); 
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const checkCardStatus = async () => {
      if (!cardRef.current) {
        console.log(
          "html-to-image DEBUG: cardRef.current is not yet available in useEffect, re-scheduling check..."
        );
        setIdCardReady(false);
        setTimeout(checkCardStatus, 50);
        return;
      }

      console.log(
        "html-to-image DEBUG: IDCard element detected. Checking fonts and images..."
      );
      const images = cardRef.current.querySelectorAll("img");
      const imageLoadPromises = Array.from(images).map((img) => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            console.log(
              `html-to-image DEBUG: Image ${img.src} is already loaded and rendered.`
            );
            return resolve();
          }
          const timer = setTimeout(() => {
            console.warn(
              `html-to-image DEBUG: Image ${img.src} timed out loading.`
            );
            resolve();
          }, 5000);

          img.onload = () => {
            clearTimeout(timer);
            console.log(
              `html-to-image DEBUG: Image ${img.src} loaded successfully.`
            );
            resolve();
          };
          img.onerror = (e) => {
            clearTimeout(timer);
            console.error(
              `html-to-image DEBUG: Image ${img.src} failed to load or has CORS issues.`,
              e
            );
            resolve();
          };
        });
      });

      try {
        await Promise.all(imageLoadPromises);
        console.log(
          "html-to-image DEBUG: All images inside IDCard are confirmed loaded (or timed out)."
        );
      } catch (err) {
        console.error("html-to-image DEBUG: Failed to await assets:", err);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIdCardReady(true);
        console.log(
          "html-to-image DEBUG: ID Card is marked as ready for capture."
        );
      }
    };

    const initialTimer = setTimeout(checkCardStatus, 100);
    return () => clearTimeout(initialTimer);
  }, [details, profilePic]);

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

  const handleDownload = async () => {
    if (!cardRef.current) {
      toast.error("ID Card element not found. Please refresh and try again.");
      console.error(
        "html-to-image DEBUG: cardRef.current is null or undefined at handleDownload start. Cannot proceed."
      );
      setIsDownloading(false);
      return;
    }
    if (!idCardReady) {
      toast.warn(
        "ID Card is not fully loaded or stable yet. Please wait a moment."
      );
      console.warn(
        "html-to-image DEBUG: ID Card not ready for capture when download button clicked. Aborting."
      );
      return;
    }

    setIsDownloading(true);
    toast.info("Generating ID Card image...", { autoClose: 3000 });

    try {
      console.log("html-to-image DEBUG: Starting image generation.");
      const rect = cardRef.current.getBoundingClientRect();
      console.log(
        "html-to-image DEBUG: Element getBoundingClientRect:",
        rect.width,
        "x",
        rect.height,
        "at",
        rect.x,
        ",",
        rect.y
      );

      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#1e293b",
        cacheBust: true,
        fontEmbedCSS: `
                  @font-face {
                      font-family: 'Orbitron';
                      font-style: normal;
                      font-weight: 400; 
                      src: url('/fonts/Orbitron-Regular.woff2') format('woff2'); 
                  }
                  @font-face {
                      font-family: 'Orbitron';
                      font-style: normal;
                      font-weight: 700; 
                      src: url('/fonts/Orbitron-Bold.woff2') format('woff2'); 
                  }
              `,
        pixelRatio: 2,
      });

      console.log(
        "html-to-image DEBUG: Image generated. Data URL length:",
        dataUrl.length
      );

      if (!dataUrl) {
        console.warn(
          "html-to-image DEBUG: Generated data URL is empty or null. Capture failed."
        );
        toast.error("Generated image is empty or invalid. Please try again.");
        setIsDownloading(false);
        return;
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `FunCard_${
        details.name.replace(/\s+/g, "_") || "user"
      }.png`;
      link.click();

      toast.success("ID Card downloaded successfully!", { autoClose: 2000 });
    } catch (err: any) {
      console.error(
        "html-to-image DEBUG: Failed to generate image, caught exception:",
        err
      );
      toast.error(`Oops! Something went wrong. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const text = `Build the Quiz. Break the Minds. 🧠💥\nthat’s what i just did on #FunQuiz a wild quiz dApp built on @Somnia_Network\n\nready to challenge the world with your own quiz?\ncreate yours 👉 https://fun-quiz.fun/create-quiz\nget your ID 👉 https://fun-quiz.fun/fun-card\n\n#SomniaCreator`;
    const encodedText = encodeURIComponent(text);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}`,
      "_blank"
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Somnia Community ID Card
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="bg-surface p-6 md:p-8 rounded-lg border border-border space-y-4">
          <Input
            label="Name"
            name="name"
            value={details.name}
            onChange={handleInputChange}
            placeholder="Your Name"
          />
          <Input
            label="Residence"
            name="residence"
            value={details.residence}
            onChange={handleInputChange}
            placeholder="e.g., Indonesia"
          />
          <Input
            label="Somnia Rank"
            name="somniaRank"
            value={details.somniaRank}
            onChange={handleInputChange}
            placeholder="e.g., 69"
          />
          <Input
            label="Somnia Roles"
            name="somniaRoles"
            value={details.somniaRoles}
            onChange={handleInputChange}
            placeholder="e.g., OGSomniac"
          />
          <Input
            label="Favorite Somnia Game"
            name="favGame"
            value={details.favGame}
            onChange={handleInputChange}
            placeholder="e.g., Chunked"
          />
          <Input
            label="Kaito 7D Rank"
            name="kaitoRank"
            value={details.kaitoRank}
            onChange={handleInputChange}
            placeholder="e.g., 69"
          />
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Di mobile, tampilkan gambar statis untuk UX yang lebih baik karena aku pusing nguliknya wkwk*/}
          {isMobile && (
            <div className="relative w-full max-w-[350px]">
              <img
                src="/sample.png"
                alt="Sample ID Card Preview"
                className="w-full rounded-lg border border-border"
              />
              {/* Overlay dengan teks "SAMPLE" */}
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                <span className="select-none text-5xl font-bold text-white tracking-widest opacity-75">
                  SAMPLE
                </span>
              </div>
            </div>
          )}

          {/* Container untuk IDCard asli.
            Di desktop, ini terlihat.
            Di mobile, ini diposisikan di luar layar agar fungsi download tetap berjalan.
          */}
          <div
            ref={cardRef}
            className={isMobile ? "absolute -left-[9999px]" : ""}
          >
            <IDCard
              key={JSON.stringify(details) + profilePic}
              {...details}
              profilePic={profilePic}
            />
          </div>

          <div className="w-full max-w-[350px] space-y-3">
            <Button
              onClick={handleDownload}
              isLoading={isDownloading || !idCardReady}
              className="w-full text-lg"
              disabled={!idCardReady}
            >
              <FaDownload className="mr-2" />
              {isDownloading
                ? "Generating..."
                : idCardReady
                ? "Download Card"
                : "Loading Card..."}
            </Button>
            <Button
              onClick={handleShare}
              className="w-full text-lg bg-gray-600 hover:bg-gray-700"
            >
              <FaXTwitter className="mr-2" /> Share to X (Twitter)
            </Button>
            <p className="text-xs text-center text-secondary">
              Download card first, then attach it to your tweet!
              <br />
              <span className="text-[10px] opacity-80">
                If it doesn't work, please use desktop mode.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunCardPage;
