import { IInputs } from "./generated/ManifestTypes";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
// Replace the any declaration with this type
declare const faceapi: {
  nets: {
    tinyFaceDetector: {
      loadFromUri: (url: string) => Promise<void>;
    };
    faceLandmark68Net: {
      loadFromUri: (url: string) => Promise<void>;
    };
  };
  detectAllFaces: (
    input: HTMLCanvasElement,
    options: TinyFaceDetectorOptions
  ) => Promise<
    Array<{ box: { x: number; y: number; width: number; height: number } }>
  >;
  TinyFaceDetectorOptions: new (options: {
    scoreThreshold: number;
  }) => TinyFaceDetectorOptions;
};

type TinyFaceDetectorOptions = {
  scoreThreshold: number;
};

export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
};

export function App({ context }: CrmParams) {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [base64Image, setBase64Image] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Update models URL to use CDN
  const models = "https://cdn.jsdelivr.net/npm/face-api.js/weights";

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

  const takePicture = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) {
      console.log("Missing requirements:", {
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
        modelsLoaded: isModelLoaded,
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Could not get canvas context");
      return;
    }

    try {
      console.log("Video dimensions:", {
        width: video.videoWidth,
        height: video.videoHeight,
      });

      // First, draw the full video frame to the canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log("Drew video to canvas");

      // Detect faces on the full frame
      const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
      );
      console.log("Face detections:", detections);

      if (detections.length > 0) {
        // Get the first detected face
        const face = detections[0];
        console.log("Face detected:", face.box);
        const padding = Math.min(face.box.width, face.box.height) * 0.5;

        // Calculate zoom area
        const zoomArea = {
          x: Math.max(0, face.box.x - padding),
          y: Math.max(0, face.box.y - padding),
          width: Math.min(
            video.videoWidth - face.box.x,
            face.box.width + padding * 2
          ),
          height: Math.min(
            video.videoHeight - face.box.y,
            face.box.height + padding * 2
          ),
        };
        console.log("Zoom area:", zoomArea);

        // Create a temporary canvas for the zoomed image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 640;
        tempCanvas.height = 480;
        const tempContext = tempCanvas.getContext("2d");

        if (tempContext) {
          tempContext.drawImage(
            canvas,
            zoomArea.x,
            zoomArea.y,
            zoomArea.width,
            zoomArea.height,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );

          const base64String = tempCanvas.toDataURL("image/jpeg").split(",")[1];
          console.log("Generated base64 string length:", base64String.length);
          setBase64Image(base64String);
        }
      } else {
        console.log("No face detected, using full frame");
        const base64String = canvas.toDataURL("image/jpeg").split(",")[1];
        setBase64Image(base64String);
      }
    } catch (error) {
      console.error("Error during face detection:", error);
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
      new_base64: base64Image,
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

  useEffect(() => {
    const loadFaceAPI = async () => {
      // First load face-api.js from CDN
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/face-api.js";
      script.async = true;
      script.onload = async () => {
        try {
          console.log("Loading models from:", models);
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(models),
            faceapi.nets.faceLandmark68Net.loadFromUri(models),
          ]);
          console.log("Models loaded successfully");
          setIsModelLoaded(true);
        } catch (error) {
          console.error("Error loading face detection models:", error);
        }
      };
      document.body.appendChild(script);
    };

    loadFaceAPI();
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
            <canvas
              ref={canvasRef}
              style={{ display: "none" }} // Hide the canvas but keep it in DOM
            />
          </div>
          <button
            onClick={takePicture}
            disabled={!isModelLoaded}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                     hover:bg-blue-700 transition-colors duration-200"
          >
            {isModelLoaded ? "Take Photo" : "Loading..."}
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
