"use client";

import { useState, useRef, useEffect } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, FileUp, Loader2, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface UploadAssignmentDialogProps {
    assignmentName: string;
    onAssignmentSubmit: (assignmentName: string) => void;
}

export default function UploadAssignmentDialog({ assignmentName: initialAssignmentName, onAssignmentSubmit }: UploadAssignmentDialogProps) {
  const [assignmentName, setAssignmentName] = useState(initialAssignmentName);
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
  
  useEffect(() => {
    setAssignmentName(initialAssignmentName);
    setCapturedImage(null);
    setShowCamera(false);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initialAssignmentName])

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
      onAssignmentSubmit(assignmentName);
    }, 1500);
  };
  
  const fileSelected = fileInputRef.current?.files && fileInputRef.current?.files?.length > 0;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">
          Upload Assignment
        </DialogTitle>
        <DialogDescription>
          Submit your assignment by taking a photo, uploading a PDF, or providing a link.
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
            readOnly
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
            <div className="space-y-4">
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input placeholder="Or paste a link (e.g., Google Doc, GitHub)" className="pl-9" />
              </div>
            </div>
        )}

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting || (!capturedImage && !fileSelected) || !assignmentName}>
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
