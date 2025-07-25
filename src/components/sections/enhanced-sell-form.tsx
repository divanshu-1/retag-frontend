'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Upload,
  Camera,
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Home,
  Phone,
  CreditCard,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { usePaymentAccount } from '@/hooks/use-payment-account';
import type { Address } from '@/components/user-provider';
import { DesktopUploadRestrictionModal } from '@/components/ui/desktop-upload-restriction-modal';
import { LoginButton } from '@/components/auth/login-button';
import { apiRequest, apiRequestJson } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PhotoStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface AIAnalysis {
  image_analysis: {
    caption: string;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    category: string;
    condition_score: number;
    features: string[];
  };
  price_suggestion: {
    suggested_price: number;
    reasoning: string;
    market_comparison: string;
    confidence_score: number;
    factors: string[];
  };
  final_recommendation: string;
}

const photoSteps: PhotoStep[] = [
  {
    id: 'front',
    title: 'Front View',
    description: 'Take a clear photo of the front of your item',
    required: true
  },
  {
    id: 'back',
    title: 'Back View',
    description: 'Show the back side of your item',
    required: true
  },
  {
    id: 'tag',
    title: 'Brand Tag',
    description: 'Close-up of the brand tag or label',
    required: false
  },
  {
    id: 'damage',
    title: 'Any Damage',
    description: 'Show any stains, tears, or imperfections',
    required: false
  }
];

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export default function EnhancedSellForm() {
  const [currentStep, setCurrentStep] = useState<'details' | 'photos' | 'analysis' | 'offer' | 'pickup'>('details');
  const [photos, setPhotos] = useState<{ [key: string]: File | null }>({});
  const [currentPhotoStep, setCurrentPhotoStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, fetchAddresses, addAddress } = useUser();
  const { paymentAccount, savePaymentAccount, isLoading: isLoadingPaymentAccount } = usePaymentAccount();

  // Payment account state - must be declared before useEffect that uses it
  const [isNewPaymentAccount, setIsNewPaymentAccount] = useState(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);

    // Show login modal first if user is not logged in
    if (!user) {
      setShowLoginModal(true);
      setShowDesktopModal(false); // Reset desktop modal
    } else {
      setShowLoginModal(false); // Reset login modal
      if (!mobile) {
        // After login, show desktop modal if on desktop
        setShowDesktopModal(true);
      }
    }
  }, [user]);

  // Fetch addresses and pre-fill phone number when user is available
  useEffect(() => {
    if (user) {
      // Pre-fill phone number from user profile if not already set
      setPickupData(prev => {
        if (user.phone && !prev.phone) {
          return { ...prev, phone: user.phone };
        }
        return prev;
      });

      // Fetch user addresses
      fetchAddresses().then(addresses => {
        setUserAddresses(addresses);
      });
    }
  }, [user, fetchAddresses]);

  // Pre-fill payment data from stored payment account
  useEffect(() => {
    if (paymentAccount && !isNewPaymentAccount) {
      setPaymentData({
        bank_account: {
          account_number: paymentAccount.account_number,
          ifsc_code: paymentAccount.ifsc_code,
          account_holder: paymentAccount.account_holder
        }
      });
    }
  }, [paymentAccount, isNewPaymentAccount]);
  
  // Form data
  const [formData, setFormData] = useState({
    article: '',
    brand: '',
    category: '',
    gender: '',
    size: '',
    age: '',
    wear_count: '',
    damage: ''
  });

  const [pickupData, setPickupData] = useState({
    address: '',
    phone: '',
    preferred_date: '',
    preferred_time: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [paymentData, setPaymentData] = useState({
    bank_account: {
      account_number: '',
      ifsc_code: '',
      account_holder: ''
    }
  });

  // Address management state
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [saveAsDefaultPickup, setSaveAsDefaultPickup] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressSelection = (addressId: string) => {
    const selectedAddress = userAddresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      const fullAddress = `${selectedAddress.house}, ${selectedAddress.area}, ${selectedAddress.pincode}`;
      setPickupData(prev => ({
        ...prev,
        address: fullAddress,
        phone: selectedAddress.phone
      }));
      setSelectedAddressId(addressId);
    }
  };

  const handleUseExistingAddressChange = (checked: boolean) => {
    setUseExistingAddress(checked);
    if (!checked) {
      // Reset to user's profile phone if unchecking
      setPickupData(prev => ({
        ...prev,
        address: '',
        phone: user?.phone || prev.phone || ''
      }));
      setSelectedAddressId('');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Format date as YYYY-MM-DD for the backend
      const formattedDate = format(date, 'yyyy-MM-dd');
      setPickupData(prev => ({ ...prev, preferred_date: formattedDate }));
    } else {
      setPickupData(prev => ({ ...prev, preferred_date: '' }));
    }
  };

  const handlePhotoCapture = (stepId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-step', stepId);
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const stepId = event.target.getAttribute('data-step');
    
    if (file && stepId) {
      setPhotos(prev => ({ ...prev, [stepId]: file }));
    }
  };

  const handleSubmitDetails = () => {
    if (!formData.article || !formData.brand || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in the article type, brand, and category.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('photos');
  };

  const handleSubmitPhotos = async () => {
    const requiredPhotos = photoSteps.filter(step => step.required);
    const hasAllRequired = requiredPhotos.every(step => photos[step.id]);
    
    if (!hasAllRequired) {
      toast({
        title: "Missing Photos",
        description: "Please take all required photos.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analysis');

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      // Append all photo files
      Object.values(photos).forEach((file) => {
        if (file) form.append('images', file);
      });
      const response = await apiRequest('/sell/submit', {
        method: 'POST',
        body: form
        // Do NOT set Content-Type; browser will set it for FormData
      });

      const data = await response.json();
      
      if (response.ok) {
        setAiAnalysis(data.product.ai_analysis);
        setSubmissionId(data.product.id);
        toast({
          title: "Analysis Complete",
          description: "AI has analyzed your item and suggested a price!",
        });
      } else {
        throw new Error(data.message || 'Failed to analyze item');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your item. Please try again.",
        variant: "destructive"
      });
      setCurrentStep('photos');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!submissionId) return;

    setIsSubmitting(true);
    try {
      // Save payment account if it's new or updated
      if ((!paymentAccount || isNewPaymentAccount) && paymentData.bank_account.account_number && paymentData.bank_account.ifsc_code && paymentData.bank_account.account_holder) {
        await savePaymentAccount({
          account_number: paymentData.bank_account.account_number,
          ifsc_code: paymentData.bank_account.ifsc_code,
          account_holder: paymentData.bank_account.account_holder
        });
      }

      // Save address as default pickup if requested and not using existing address
      if (saveAsDefaultPickup && !useExistingAddress && pickupData.address && pickupData.phone) {
        try {
          // Parse the address to save it properly
          const addressParts = pickupData.address.split(',').map(part => part.trim());
          if (addressParts.length >= 2) {
            const newAddress: Omit<Address, '_id'> = {
              name: user?.name || user?.displayName || 'Pickup Address',
              phone: pickupData.phone,
              house: addressParts[0] || '',
              area: addressParts.slice(1, -1).join(', ') || '',
              pincode: addressParts[addressParts.length - 1] || '',
              isDefault: false // Don't set as default delivery address
            };
            await addAddress(newAddress);
          }
        } catch (addressError) {
          console.error('Failed to save address:', addressError);
          // Continue with offer acceptance even if address saving fails
        }
      }

      const response = await apiRequest(`/sell/accept-offer/${submissionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pickup_details: pickupData,
          payment_details: paymentData
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Offer Accepted!",
          description: "We'll contact you soon to arrange pickup.",
        });
        setCurrentStep('pickup');
      } else {
        throw new Error(data.message || 'Failed to accept offer');
      }
    } catch (error) {
      console.error('Accept offer error:', error);
      toast({
        title: "Error",
        description: "Failed to accept offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectOffer = async () => {
    if (!submissionId) return;

    try {
      const response = await apiRequest(`/sell/reject-offer/${submissionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Price too low'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Offer Rejected",
          description: "Your submission has been cancelled.",
        });
        // Reset form
        setCurrentStep('details');
        setPhotos({});
        setAiAnalysis(null);
        setSubmissionId(null);
      } else {
        throw new Error(data.message || 'Failed to reject offer');
      }
    } catch (error) {
      console.error('Reject offer error:', error);
      toast({
        title: "Error",
        description: "Failed to reject offer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDetailsStep = () => (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
        <CardDescription>
          Provide as much detail as possible for a better price suggestion.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="article">Article Type *</Label>
              <Input
                type="text"
                id="article"
                placeholder="e.g., T-Shirt, Handbag"
                value={formData.article}
                onChange={(e) => handleInputChange('article', e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                type="text"
                id="brand"
                placeholder="e.g., Zara, Nike"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tops">Tops</SelectItem>
                  <SelectItem value="Bottoms">Bottoms</SelectItem>
                  <SelectItem value="Dresses">Dresses</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Bags">Bags</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Activewear">Activewear</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="size">Size</Label>
              <Input
                type="text"
                id="size"
                placeholder="e.g., M, 32, UK 8"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="age">Age of Item</Label>
              <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
                <SelectTrigger id="age">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1">Less than a year</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value=">3">More than 3 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="wear_count">Times Worn (approx.)</Label>
              <Input 
                type="number" 
                id="wear_count" 
                placeholder="e.g., 5" 
                value={formData.wear_count}
                onChange={(e) => handleInputChange('wear_count', e.target.value)}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="damage">Damage Description</Label>
            <Textarea 
              placeholder="Describe any stains, tears, or other imperfections." 
              id="damage" 
              value={formData.damage}
              onChange={(e) => handleInputChange('damage', e.target.value)}
            />
          </div>

          <Button onClick={handleSubmitDetails} className="font-bold px-8 w-full sm:w-auto mt-4">
            Next: Take Photos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPhotosStep = () => (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Take Photos</CardTitle>
        <CardDescription>
          Take clear photos of your item. Required photos are marked with *.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          {photoSteps.map((step, index) => (
            <div key={step.id} className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">
                    {step.title} {step.required && <span className="text-red-500">*</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {photos[step.id] && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              
              {photos[step.id] ? (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(photos[step.id] as File)}
                    alt={step.title}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePhotoCapture(step.id)}
                    className="mt-2"
                  >
                    Retake Photo
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handlePhotoCapture(step.id)}
                  variant="outline"
                  className="w-full h-32 border-dashed"
                >
                  <div className="flex flex-col items-center">
                    <Camera className="h-8 w-8 mb-2" />
                    <span>Take Photo</span>
                  </div>
                </Button>
              )}
            </div>
          ))}

          <Input
            ref={fileInputRef}
            id="dropzone-file"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('details')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleSubmitPhotos}
              className="flex-1 w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAnalysisStep = () => (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>AI Analysis Results</CardTitle>
        <CardDescription>
          Our AI has analyzed your item and suggested a price.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Analyzing your item with AI...</p>
            <Progress value={33} className="mt-4" />
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-6">
            {/* Image Analysis */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Image Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Caption</p>
                  <p className="font-medium">{aiAnalysis.image_analysis.caption}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality</p>
                  <Badge className={getQualityColor(aiAnalysis.image_analysis.quality)}>
                    {aiAnalysis.image_analysis.quality}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category (Your Selection)</p>
                  <p className="font-medium">{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition Score</p>
                  <p className="font-medium">{aiAnalysis.image_analysis.condition_score}/10</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">Features</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {aiAnalysis.image_analysis.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Suggestion */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Price Suggestion</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary">
                  ₹{aiAnalysis.price_suggestion.suggested_price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: {(aiAnalysis.price_suggestion.confidence_score * 100).toFixed(0)}%
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Reasoning</p>
                  <p className="text-sm">{aiAnalysis.price_suggestion.reasoning}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Comparison</p>
                  <p className="text-sm">{aiAnalysis.price_suggestion.market_comparison}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Factors Considered</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {aiAnalysis.price_suggestion.factors.map((factor, index) => (
                      <Badge key={index} variant="outline">{factor}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleRejectOffer}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Offer
              </Button>
              <Button
                onClick={() => setCurrentStep('offer')}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Offer
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const renderOfferStep = () => (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Accept Offer</CardTitle>
        <CardDescription>
          Provide pickup and payment details to accept the offer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pickup Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Pickup Details
            </h3>

            {/* Address Selection Options */}
            {userAddresses.length > 0 && (
              <div className="mb-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-existing-address"
                    checked={useExistingAddress}
                    onCheckedChange={handleUseExistingAddressChange}
                  />
                  <Label htmlFor="use-existing-address" className="text-sm font-medium">
                    Use one of my saved addresses
                  </Label>
                </div>

                {useExistingAddress && (
                  <div className="ml-6 space-y-2">
                    {userAddresses.map((address) => (
                      <div key={address._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`address-${address._id}`}
                          checked={selectedAddressId === address._id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleAddressSelection(address._id!);
                            }
                          }}
                        />
                        <Label htmlFor={`address-${address._id}`} className="text-sm cursor-pointer">
                          <div className="font-medium">{address.name}</div>
                          <div className="text-muted-foreground">
                            {address.house}, {address.area}, {address.pincode}
                          </div>
                          <div className="text-muted-foreground">{address.phone}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your pickup address"
                  value={pickupData.address}
                  onChange={(e) => setPickupData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={useExistingAddress}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={pickupData.phone}
                  onChange={(e) => setPickupData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date">Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Preferred Time *</Label>
                <Select value={pickupData.preferred_time} onValueChange={(value) => setPickupData(prev => ({ ...prev, preferred_time: value }))}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 3 PM)</SelectItem>
                    <SelectItem value="evening">Evening (3 PM - 6 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Save as default pickup address option */}
            {!useExistingAddress && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-default-pickup"
                    checked={saveAsDefaultPickup}
                    onCheckedChange={setSaveAsDefaultPickup}
                  />
                  <Label htmlFor="save-default-pickup" className="text-sm">
                    Save this address for future pickups
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Details
            </h3>

            {paymentAccount && !isNewPaymentAccount ? (
              // Show stored payment account with option to change
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Using your saved payment account:</p>
                  <div className="space-y-1">
                    <p><strong>Account Holder:</strong> {paymentAccount.account_holder}</p>
                    <p><strong>Account Number:</strong> ****{paymentAccount.account_number.slice(-4)}</p>
                    <p><strong>IFSC Code:</strong> {paymentAccount.ifsc_code}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setIsNewPaymentAccount(true)}
                  >
                    Use Different Account
                  </Button>
                </div>
              </div>
            ) : (
              // Show form to enter payment details
              <div className="space-y-4">
                {paymentAccount && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Enter new payment account details:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNewPaymentAccount(false)}
                    >
                      Use Saved Account
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    placeholder="Account number"
                    value={paymentData.bank_account.account_number}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      bank_account: { ...prev.bank_account, account_number: e.target.value }
                    }))}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    placeholder="IFSC code"
                    value={paymentData.bank_account.ifsc_code}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      bank_account: { ...prev.bank_account, ifsc_code: e.target.value }
                    }))}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="account_holder">Account Holder Name</Label>
                  <Input
                    id="account_holder"
                    placeholder="Account holder name"
                    value={paymentData.bank_account.account_holder}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      bank_account: { ...prev.bank_account, account_holder: e.target.value }
                    }))}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Option to save new payment account */}
              {(!paymentAccount || isNewPaymentAccount) && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-payment-account"
                    checked={true}
                    disabled
                  />
                  <Label htmlFor="save-payment-account" className="text-sm">
                    Save this account for future transactions
                  </Label>
                </div>
              )}
            </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('analysis')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleAcceptOffer}
              disabled={isSubmitting || !pickupData.address || !pickupData.phone || !pickupData.preferred_date || !pickupData.preferred_time}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept Offer
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPickupStep = () => (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Offer Accepted!</CardTitle>
        <CardDescription>
          Thank you for choosing ReTag. We'll contact you soon to arrange pickup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your item is being processed</h3>
          <p className="text-muted-foreground mb-6">
            We'll review your submission and contact you within 24 hours to arrange pickup.
          </p>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Our team will review your item</li>
              <li>• We'll contact you to schedule pickup</li>
              <li>• After pickup, we'll process your payment</li>
              <li>• Your item will be listed in our store</li>
            </ul>
          </div>

          <Button onClick={() => window.location.href = '/'}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // 1. If not logged in, show login modal
  if (!user) {
    return (
      <section id="sell-form" className="py-16 sm:py-24 bg-card">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline tracking-tight text-primary">
              Sell Your Item
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Please log in to start selling your pre-loved items.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <LoginButton>
              <Button size="lg" className="font-bold px-8 py-4 text-lg">
                Log in to sell your items
              </Button>
            </LoginButton>
          </div>
        </div>
      </section>
    );
  }

  // 2. If desktop, show restriction modal and info/steps (no upload form)
  if (!isMobile) {
    return (
      <>
        <DesktopUploadRestrictionModal open={showDesktopModal} onClose={() => setShowDesktopModal(false)} />
        <section id="sell-form" className="py-16 sm:py-24 bg-card">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline tracking-tight text-primary">
                Sell Your Item
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                For authenticity, photos must be taken with your mobile camera. Please use your mobile device to continue.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // 3. If mobile and logged in, show the full upload form
  return (
    <section id="sell-form" className="py-16 sm:py-24 bg-card">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline tracking-tight text-primary">
            Sell Your Item
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow the steps below to list your pre-loved item with AI-powered pricing.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['details', 'photos', 'analysis', 'offer', 'pickup'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                  currentStep === step
                    ? 'bg-primary text-primary-foreground'
                    : index < ['details', 'photos', 'analysis', 'offer', 'pickup'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 ${
                    index < ['details', 'photos', 'analysis', 'offer', 'pickup'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="w-full">
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'photos' && renderPhotosStep()}
          {currentStep === 'analysis' && renderAnalysisStep()}
          {currentStep === 'offer' && renderOfferStep()}
          {currentStep === 'pickup' && renderPickupStep()}
        </div>
      </div>
    </section>
  );
} 