import { IInputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as faceapi from "face-api.js";

export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
};

export const App: React.FC<CrmParams> = ({ context }) => {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Load face-api models
  const loadModels = async () => {
    try {
      setIsLoading(true);
      // Load models directly from CDN
      const modelUrl = "https://justadudewhohacks.github.io/face-api.js/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
      ]);
      setIsModelLoaded(true);
    } catch (err) {
      console.error("Error loading models:", err);
      alert("Failed to load face detection models. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const detectAndCropFace = async (
    imageElement: HTMLImageElement
  ): Promise<string | null> => {
    try {
      setIsLoading(true);
      if (!isModelLoaded) return null;

      const detection = await faceapi.detectSingleFace(
        imageElement,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (!detection) {
        +console.log("No face detected");
        return null;
      }

      // Add padding around the face
      const box = detection.box;
      const padding = {
        width: box.width * 0.5,
        height: box.height * 0.5,
      };

      // Create canvas for cropping
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return null;

      // Set canvas size to face detection box + padding
      canvas.width = box.width + padding.width * 2;
      canvas.height = box.height + padding.height * 2;

      // Draw cropped face on canvas
      context.drawImage(
        imageElement,
        box.x - padding.width,
        box.y - padding.height,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      return canvas.toDataURL("image/jpeg");
    } finally {
      setIsLoading(false);
    }
  };

  const takePicture = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      const fullImageData = canvas.toDataURL("image/jpeg");

      // Create temporary image element for face detection
      const img = new Image();
      img.src = fullImageData;
      img.onload = async () => {
        const croppedFace = await detectAndCropFace(img);
        if (croppedFace) {
          setCapturedImage(croppedFace);
        } else {
          alert("No face detected. Please try again.");
        }
      };
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const saveImage = () => {
    if (!capturedImage) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `captured-image-${new Date().getTime()}.jpg`;

    // Programmatically click the link to trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
    loadModels();
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!isModelLoaded) {
    return <div>Loading face detection models...</div>;
  }

  return (
    <div style={{ maxWidth: "500px" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "10px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            textAlign: "center",
          }}
        >
          Processing...
        </div>
      )}
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
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={retake}>Retake Picture</button>
            <button onClick={saveImage}>Save Picture</button>
          </div>
        </>
      )}
    </div>
  );
};
