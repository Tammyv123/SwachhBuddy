import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Package, CheckCircle, Clock, Truck, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchedulePickupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulePickup = ({ isOpen, onClose }: SchedulePickupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupScheduled, setPickupScheduled] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    address: '',
    contactNumber: '',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    urgency: 'normal'
  });

  const { toast } = useToast();

  const wasteTypes = [
    { value: 'bulk-furniture', label: 'Bulk Furniture', price: 'Free', description: 'Old furniture, mattresses' },
    { value: 'electronic', label: 'Electronic Waste', price: 'Free', description: 'Computers, phones, appliances' },
    { value: 'construction', label: 'Construction Debris', price: '₹200', description: 'Tiles, cement, wood' },
    { value: 'garden', label: 'Garden Waste', price: 'Free', description: 'Branches, leaves, organic matter' },
    { value: 'hazardous', label: 'Hazardous Waste', price: '₹150', description: 'Batteries, chemicals, paint' },
    { value: 'mixed-bulk', label: 'Mixed Bulk Waste', price: '₹100', description: 'Large quantities of mixed waste' }
  ];

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM', 
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const handleSubmit = () => {
    setPickupScheduled(true);
    toast({
      title: "Pickup Scheduled Successfully! 📅",
      description: "You'll receive a confirmation call within 2 hours.",
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setPickupScheduled(false);
    setFormData({
      wasteType: '',
      quantity: '',
      address: '',
      contactNumber: '',
      preferredDate: '',
      preferredTime: '',
      specialInstructions: '',
      urgency: 'normal'
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedWasteType = wasteTypes.find(type => type.value === formData.wasteType);

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Special Pickup
          </AlertDialogTitle>
          <AlertDialogDescription>
            Request collection for bulk or special waste items
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {!pickupScheduled ? (
            <>
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Waste Type Selection */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Waste Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {wasteTypes.map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-eco ${
                          formData.wasteType === type.value ? 'ring-2 ring-primary shadow-eco' : ''
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, wasteType: type.value }))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{type.label}</h4>
                            <Badge variant={type.price === 'Free' ? 'default' : 'secondary'}>
                              {type.price}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="eco"
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.wasteType}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Pickup Details</h3>
                    <Badge variant="outline">{selectedWasteType?.label}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Estimated Quantity</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, quantity: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1-2 bags/items)</SelectItem>
                          <SelectItem value="medium">Medium (3-5 bags/items)</SelectItem>
                          <SelectItem value="large">Large (6-10 bags/items)</SelectItem>
                          <SelectItem value="bulk">Bulk (10+ bags/items)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal (3-5 days)</SelectItem>
                          <SelectItem value="urgent">Urgent (1-2 days)</SelectItem>
                          <SelectItem value="emergency">Emergency (Same day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Pickup Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Enter complete pickup address with landmarks"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button 
                      variant="eco" 
                      onClick={() => setCurrentStep(3)}
                      disabled={!formData.quantity || !formData.address || !formData.contactNumber}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule Pickup</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Preferred Time Slot</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Any special instructions for the pickup team..."
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    />
                  </div>

                  {/* Summary */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-base">Pickup Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Waste Type:</span>
                        <span className="font-medium">{selectedWasteType?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium capitalize">{formData.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Charge:</span>
                        <span className="font-medium">{selectedWasteType?.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Urgency:</span>
                        <span className="font-medium capitalize">{formData.urgency}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button 
                      variant="eco" 
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!formData.preferredDate || !formData.preferredTime}
                    >
                      Schedule Pickup
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Confirmation */
            <div className="text-center py-6">
              <div className="mx-auto mb-4 p-6 bg-success/10 rounded-full w-24 h-24 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-xl font-bold text-success mb-2">
                Pickup Scheduled Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your special waste pickup has been scheduled. Our team will contact you for confirmation.
              </p>
              
              <Card className="text-left mb-6">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Pickup ID:</span>
                    <span className="font-medium">SP{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Date:</span>
                    <span className="font-medium">{formData.preferredDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Slot:</span>
                    <span className="font-medium">{formData.preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Type:</span>
                    <span className="font-medium">{selectedWasteType?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-medium">{formData.contactNumber}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span className="font-medium">What's Next?</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Confirmation call within 2 hours</li>
                  <li>• SMS with exact pickup time 1 day before</li>
                  <li>• Vehicle tracking details on pickup day</li>
                </ul>
              </div>

              <Button variant="eco" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </div>

        {!pickupScheduled && (
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SchedulePickup;