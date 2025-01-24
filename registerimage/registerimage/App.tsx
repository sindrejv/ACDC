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

  const saveImage = () => {
    if (!base64Image) return;

    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${base64Image}`;
    link.download = `captured-image-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="max-w-500">
      {!base64Image ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full mb-10" />
          <button onClick={takePicture}>Take Picture</button>
        </>
      ) : (
        <>
          <img
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="Captured"
            className="w-full mb-10"
          />
          <div className="flex gap-10">
            <button onClick={retake}>Retake Picture</button>
            <button onClick={saveImage}>Save Picture</button>
          </div>
        </>
      )}
    </div>
  );
}
