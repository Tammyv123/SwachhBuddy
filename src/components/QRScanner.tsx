import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { QrCode, CheckCircle, XCircle, Camera, Loader2, Award, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsEarned: (points: number) => void;
}

const QRScanner = ({ isOpen, onClose, onPointsEarned }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    wasteType: string;
    location: string;
    points: number;
    qrData?: string;
  } | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const startCameraScanning = async () => {
    try {
      setIsScanning(true);
      setScanMode('camera');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Simulate QR detection after 3 seconds
        setTimeout(() => {
          if (isScanning) {
            const simulatedQRData = `waste-bin-${Math.floor(Math.random() * 1000)}`;
            handleQRCodeDetected(simulatedQRData);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
      setIsScanning(false);
      setScanMode(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      setScanMode('upload');
      
      // Simulate QR scanning from uploaded image
      setTimeout(() => {
        const simulatedQRData = `waste-bin-${Math.floor(Math.random() * 1000)}`;
        handleQRCodeDetected(simulatedQRData);
      }, 2000);
    } catch (error) {
      console.error('Error scanning QR from image:', error);
      toast({
        title: "Scan Failed",
        description: "No QR code found in the uploaded image.",
        variant: "destructive",
      });
      setIsScanning(false);
      setScanMode(null);
    }
  };

  const handleQRCodeDetected = (qrData: string) => {
    stopCamera();
    
    // Simulate verification based on QR data
    const isValidWasteQR = qrData.includes('waste') || qrData.includes('bin') || Math.random() > 0.3;
    const wasteTypes = ['Wet Waste', 'Dry Waste', 'Recyclable', 'Hazardous'];
    const locations = ['Park Street Bin', 'Mall Food Court', 'Community Center', 'Metro Station', 'Office Complex'];
    
    const result = {
      success: isValidWasteQR,
      wasteType: wasteTypes[Math.floor(Math.random() * wasteTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      points: isValidWasteQR ? 25 : 0,
      qrData
    };
    
    setScanResult(result);
    setIsScanning(false);
    
    if (result.success) {
      onPointsEarned(result.points);
      toast({
        title: "Great Job! 🎉",
        description: `Correct segregation verified! +${result.points} points earned.`,
      });
    } else {
      toast({
        title: "Invalid QR Code",
        description: "This QR code is not from a waste disposal point.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    stopCamera();
    setScanResult(null);
    setIsScanning(false);
    setScanMode(null);
    onClose();
  };

  const resetScanner = () => {
    stopCamera();
    setScanResult(null);
    setIsScanning(false);
    setScanMode(null);
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            QR Code Scanner
          </AlertDialogTitle>
          <AlertDialogDescription>
            Scan QR codes at waste disposal points to verify correct segregation
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-6">
          {!scanMode && !scanResult && (
            <div className="text-center space-y-4">
              <div className="mx-auto mb-4 p-6 bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                <QrCode className="h-12 w-12 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                Choose how to scan the QR code
              </p>
              <div className="space-y-3">
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={startCameraScanning}
                  className="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload from Gallery
                </Button>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {scanMode === 'camera' && isScanning && (
            <div className="text-center space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-sm mx-auto rounded-lg bg-black"
                  style={{ aspectRatio: '1' }}
                />
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary"></div>
                </div>
              </div>
              <p className="text-muted-foreground">
                Position the QR code within the frame
              </p>
              <Button variant="outline" onClick={resetScanner}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}

          {scanMode === 'upload' && isScanning && (
            <div className="text-center">
              <div className="mx-auto mb-4 p-6 bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground">
                Scanning uploaded image for QR code...
              </p>
            </div>
          )}

          {scanResult && (
            <div className="text-center">
              <div className={`mx-auto mb-4 p-6 rounded-full w-24 h-24 flex items-center justify-center ${
                scanResult.success ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                {scanResult.success ? (
                  <CheckCircle className="h-12 w-12 text-success" />
                ) : (
                  <XCircle className="h-12 w-12 text-destructive" />
                )}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                scanResult.success ? 'text-success' : 'text-destructive'
              }`}>
                {scanResult.success ? 'Verification Successful!' : 'Invalid QR Code'}
              </h3>
              
              <div className="space-y-2 mb-4">
                {scanResult.success && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Location: {scanResult.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Waste Type: {scanResult.wasteType}
                    </p>
                    <div className="flex items-center justify-center">
                      <Award className="mr-1 h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">+{scanResult.points} Points</span>
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground">
                  QR Data: {scanResult.qrData?.substring(0, 30)}...
                </p>
              </div>
              
              {!scanResult.success && (
                <div className="bg-muted/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Make sure to scan QR codes only from official waste disposal bins
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          {scanResult ? (
            <AlertDialogAction onClick={handleClose}>
              Done
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleClose}>
              Cancel
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QRScanner;