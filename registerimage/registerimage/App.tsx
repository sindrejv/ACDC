import { IInputs } from "./generated/ManifestTypes";
import * as React from "react";

export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
};

export function App({ context }: CrmParams) {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [base64Image, setBase64Image] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const takePicture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      // Convert to base64 and remove the data:image/jpeg;base64, prefix
      const base64String = canvas.toDataURL("image/jpeg").split(",")[1];
      setBase64Image(base64String);
    }
  };

  const retake = () => {
    setBase64Image(null);
    startCamera();
  };

  const saveImage = async () => {
    if (!base64Image) return;
    const entityId = context.parameters.entityId.raw;
    if (!entityId) {
      throw new Error("Entity ID is required");
    }
    const data: ComponentFramework.WebApi.Entity = {
      new_image: base64Image,
    };

    try {
      await context.webAPI.updateRecord("new_challenge", entityId, data);
      await context.navigation.openAlertDialog({
        text: "Image saved successfully",
      });
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {!base64Image ? (
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={takePicture}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                     hover:bg-blue-700 transition-colors duration-200"
          >
            Take Picture
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${base64Image}`}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={retake}
              className="py-3 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg
                       hover:bg-gray-300 transition-colors duration-200"
            >
              Retake Picture
            </button>
            <button
              onClick={saveImage}
              className="py-3 px-4 bg-green-600 text-white font-medium rounded-lg
                       hover:bg-green-700 transition-colors duration-200"
            >
              Save Picture
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
