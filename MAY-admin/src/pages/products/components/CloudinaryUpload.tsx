import { useEffect, useRef } from "react";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
}

export default function CloudinaryUpload({
  onUpload,
}: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (!window.cloudinary) return;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url"],
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        folder: "products",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxImageFileSize: 2000000,
        cropping: true,
        croppingAspectRatio: 1,
        showAdvancedOptions: false,
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return;
        }

        if (result && result.event === "success") {
          onUpload?.(result.info.secure_url);
        }
      }
    );
    console.log('window.cloudinary:', window.cloudinary)
    console.log('cloudName:', cloudName)
    console.log('uploadPreset:', uploadPreset)
  }, [cloudName, uploadPreset, onUpload]);

  return (
    <button
      type="button"
      onClick={() => widgetRef.current?.open()}
      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition"
    >
      <p className="text-sm font-medium text-gray-700">Click to upload image</p>
      <p className="text-xs text-gray-500 mt-1">
        Upload from Local or Image URL
      </p>
    </button>

  );
}