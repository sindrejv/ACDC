import { IInputs } from "./generated/ManifestTypes";
import * as React from "react";

export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
};

export const App: React.FC<CrmParams> = ({ context }) => {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
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
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
    }
  };

  const retake = () => {
    setCapturedImage(null);
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
    <div style={{ maxWidth: "500px" }}>
      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={takePicture}>Take Picture</button>
        </>
      ) : (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={retake}>Retake Picture</button>
        </>
      )}
    </div>
  );
};
