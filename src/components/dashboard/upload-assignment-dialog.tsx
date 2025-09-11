"use client";

import { useState, useRef, useEffect } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, FileUp, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export default function UploadAssignmentDialog() {
  const [assignmentName, setAssignmentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!showCamera) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions to use this feature.",
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [showCamera, toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      setShowCamera(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Assignment Submitted!",
        description: `"${assignmentName}" has been uploaded successfully.`,
      });
      // Reset state and close dialog could be done here
    }, 1500);
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">
          Upload Assignment
        </DialogTitle>
        <DialogDescription>
          Enter the assignment name, then choose to upload a PDF or take a
          photo.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="assignment-name">Assignment Name</Label>
          <Input
            id="assignment-name"
            placeholder="e.g., Physics Lab Report"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            required
          />
        </div>

        {showCamera && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                />
            </div>
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser to use this feature.
                </AlertDescription>
              </Alert>
            )}
            <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
          </div>
        )}

        {capturedImage && !showCamera && (
            <div className="space-y-2">
                <Label>Captured Image</Label>
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                    <Image src={capturedImage} alt="Captured assignment" fill objectFit="contain" />
                </div>
                <Button variant="outline" size="sm" onClick={() => setCapturedImage(null)} className="w-full">
                    Retake Photo
                </Button>
            </div>
        )}


        {!showCamera && !capturedImage && (
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" onClick={() => setShowCamera(true)}>
                <Camera className="mr-2 h-4 w-4" />
                Click Photo
              </Button>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" />
            </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting || (!capturedImage && !fileInputRef.current?.files?.length) || !assignmentName}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Assignment"
            )}
          </Button>
        </DialogFooter>
      </form>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
