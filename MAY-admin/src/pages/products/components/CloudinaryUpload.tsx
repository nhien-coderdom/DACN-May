import { useEffect, useRef } from "react";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
}

export default function CloudinaryUpload({ onUpload }: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);
  const onUploadRef = useRef(onUpload);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // ✅ luôn giữ callback mới nhất
  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  // ✅ chỉ tạo widget 1 lần
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

        if (result?.event === "success") {
          onUploadRef.current?.(result.info.secure_url);
        }
      }
    );

    // ✅ cleanup tránh memory leak
    return () => {
      widgetRef.current = null;
    };
  }, [cloudName, uploadPreset]);

  return (
    <button
      type="button"
      onClick={() => widgetRef.current?.open()}
      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500"
    >
      Click to upload image
    </button>
  );
}