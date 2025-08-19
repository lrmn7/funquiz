export const runtime = "edge";

import { NextResponse } from "next/server";

function dataURLToBuffer(dataURL: string): Buffer {
  const base64Data = dataURL.split(",")[1];
  if (!base64Data) {
    throw new Error("Invalid Data URL format");
  }
  return Buffer.from(base64Data, "base64");
}

export async function POST(request: Request) {
  const PINATA_JWT = process.env.PINATA_JWT;
  if (!PINATA_JWT) {
    return NextResponse.json(
      { error: "Pinata JWT not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { image, cardDetails } = body;

    if (!image || !cardDetails || !cardDetails.name) {
      return NextResponse.json(
        { error: "Missing image data or card details" },
        { status: 400 }
      );
    }

    const imageBuffer = dataURLToBuffer(image);

    const imageArrayBuffer = imageBuffer.buffer.slice(
      imageBuffer.byteOffset,
      imageBuffer.byteOffset + imageBuffer.byteLength
    ) as ArrayBuffer;
    const imageBlob = new Blob([imageArrayBuffer], { type: "image/png" });

    const imageData = new FormData();
    imageData.append(
      "file",
      imageBlob,
      `FunCard_${cardDetails.name.replace(/\s+/g, "_")}.png`
    );

    const imageUploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: imageData,
      }
    );

    if (!imageUploadRes.ok) {
      console.error("Pinata image upload failed:", await imageUploadRes.text());
      throw new Error("Failed to upload image to IPFS");
    }
    const imageUploadData = await imageUploadRes.json();
    const imageIpfsHash = imageUploadData.IpfsHash;

    const metadata = {
      name: `FunCard - ${cardDetails.name}`,
      description: `A unique Somnia Community ID Card for ${cardDetails.name}.`,
      image: `ipfs://${imageIpfsHash}`,
      attributes: Object.entries(cardDetails)
        .filter(([, value]) => value !== "")
        .map(([trait_type, value]) => ({ trait_type, value })),
    };

    const metadataUploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({ pinataContent: metadata }),
      }
    );

    if (!metadataUploadRes.ok) {
      console.error(
        "Pinata metadata upload failed:",
        await metadataUploadRes.text()
      );
      throw new Error("Failed to upload metadata to IPFS");
    }
    const metadataUploadData = await metadataUploadRes.json();
    const metadataIpfsHash = metadataUploadData.IpfsHash;

    return NextResponse.json(
      { metadataUrl: `ipfs://${metadataIpfsHash}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
