"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Check, ChevronUp, ChevronDown, Info, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { getBackendUrl } from '@/lib/backend-url';

type Address = {
  _id?: string;
  pincode: string;
  house: string;
  area: string;
  isDefault: boolean;
  name: string;
  phone: string;
};

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Address>({
    pincode: '',
    house: '',
    area: '',
    isDefault: false,
    name: '',
    phone: '',
    _id: undefined,
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lastPaymentData, setLastPaymentData] = useState<any>(null);
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const [priceDetailsExpanded, setPriceDetailsExpanded] = useState(false);
  const [bagExpanded, setBagExpanded] = useState(false);
  const [convenienceChargesModalOpen, setConvenienceChargesModalOpen] = useState(false);

  const manualVerifyPayment = async () => {
    if (!lastPaymentData) return;

    setIsPaying(true);
    try {
      console.log('Manual verification attempt with data:', lastPaymentData);

      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          order_id: lastPaymentData.razorpay_order_id,
          payment_id: lastPaymentData.razorpay_payment_id,
          signature: lastPaymentData.razorpay_signature
        })
      });

      if (!verifyRes.ok) {
        throw new Error(`HTTP ${verifyRes.status}: ${verifyRes.statusText}`);
      }

      const verifyData = await verifyRes.json();
      console.log('Manual verification response:', verifyData);

      if (verifyData.success) {
        clearCart();
        toast({
          title: "Payment Verified Successfully!",
          description: "Your order has been placed successfully.",
        });
        window.location.href = '/order-success';
      } else {
        toast({
          title: "Manual Verification Failed",
          description: verifyData.message || 'Please contact support for assistance.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Manual verification error:', error);

      let errorMessage = "Please contact support with your payment details.";
      if (error instanceof Error) {
        if (error.message.includes('Cannot connect') || error.message.includes('fetch')) {
          errorMessage = "Cannot connect to payment server. Please check your internet connection and try again.";
        } else if (error.message.includes('HTTP 500')) {
          errorMessage = "Payment server error. Please contact support with your Order ID and Payment ID.";
        } else if (error.message.includes('HTTP 404')) {
          errorMessage = "Order not found. Please contact support with your payment details.";
        }
      }

      toast({
        title: "Manual Verification Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPaying(false);
    }
  };

  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('₹', ''));
    return acc + price; // Each item has quantity 1
  }, 0);
  const originalTotal = items.reduce((acc, item) => {
    const original = parseFloat(item.originalPrice?.replace('₹', '') || item.price.replace('₹', ''));
    return acc + original; // Each item has quantity 1
  }, 0);
  const savings = originalTotal - subtotal;
  const convenienceCharges = 29; // Fixed convenience charge
  const finalAmount = subtotal + convenienceCharges;

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user/addresses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch addresses');
        const data = await res.json();
        setAddresses(data);
      } catch (err) {
        setError('Failed to fetch addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddr?._id || addresses[0]._id || null);
    }
  }, [addresses]);

  const openAddAddress = () => {
    setIsEdit(false);
    setForm({ pincode: '', house: '', area: '', isDefault: false, name: '', phone: '', _id: undefined });
    setAddressDialogOpen(true);
  };
  const openEditAddress = (addr: Address) => {
    setIsEdit(true);
    setForm(addr);
    setAddressDialogOpen(true);
  };

  const handleDialogAction = async () => {
    const token = localStorage.getItem('token');
    if (isEdit && form._id) {
      // Update address
      const res = await fetch(`/api/user/addresses/${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } else {
      // Add new address
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    }
    setAddressDialogOpen(false);
  };

  // Helper for PIN code input as boxes
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForm(f => ({ ...f, pincode: value }));
  };

  // Razorpay payment handler
  const handleContinueToPayment = async () => {
    if (!selectedAddressId) return;
    setIsPaying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          addressId: selectedAddressId,
          cart: items,
          amount: finalAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: data.currency,
        order_id: data.id || data.orderId,
        name: 'ReTag Marketplace',
        description: 'Order Payment',
        handler: async function (response: any) {
          console.log('Payment completed, verifying...', response);
          setPaymentCompleted(true);
          setLastPaymentData(response);

          // Verify payment on backend before redirecting
          let retryCount = 0;
          const maxRetries = 3;

          const verifyPayment = async () => {
            try {
              console.log(`Payment verification attempt ${retryCount + 1}/${maxRetries}`);
              console.log('Payment response data:', response);

              // First check if server is reachable
              console.log('Checking server health...');
              const healthCheck = await fetch(`${getBackendUrl()}/health`, {
                method: 'GET',
                headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
                }
              }).catch((error) => {
                console.error('Health check failed:', error);
                return null;
              });

              if (!healthCheck || !healthCheck.ok) {
                throw new Error('Cannot connect to payment server. Please check your connection.');
              }

              console.log('Server is reachable, proceeding with payment verification...');

              const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/payments/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature
                })
              });

              if (!verifyRes.ok) {
                throw new Error(`HTTP ${verifyRes.status}: ${verifyRes.statusText}`);
              }

              const verifyData = await verifyRes.json();
              console.log('Verification response:', verifyData);

              if (verifyData.success) {
                // Payment verified successfully, clear cart and redirect to success page
                clearCart();
                toast({
                  title: "Payment Successful!",
                  description: "Your order has been placed successfully.",
                });
                console.log('Payment verified, redirecting to success page');
                window.location.href = '/order-success';
                return true;
              } else {
                throw new Error(verifyData.message || 'Payment verification failed');
              }
            } catch (error) {
              console.error(`Payment verification attempt ${retryCount + 1} failed:`, error);

              // Provide more specific error messages
              let errorMessage = "Payment completed but automatic verification failed.";
              if (error instanceof Error) {
                if (error.message.includes('Cannot connect')) {
                  errorMessage = "Cannot connect to payment server. Please check your internet connection.";
                } else if (error.message.includes('HTTP 500')) {
                  errorMessage = "Payment server error. Our team has been notified.";
                } else if (error.message.includes('HTTP 404')) {
                  errorMessage = "Payment verification service unavailable. Please try manual verification.";
                }
              }

              if (retryCount < maxRetries - 1) {
                retryCount++;
                console.log(`Retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return verifyPayment();
              } else {
                // All retries failed - show manual verification option
                toast({
                  title: "Payment Verification Failed",
                  description: `${errorMessage} You can try manual verification below.`,
                  variant: "destructive",
                });
                console.error('All payment verification attempts failed');
                return false;
              }
            }
          };

          try {
            await verifyPayment();
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: function() {
            // Payment was cancelled by user
            setIsPaying(false);
          }
        },
        prefill: {},
        theme: { color: '#000' },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setIsPaying(false);
    }
  };

  const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

  // Mobile address selection screen
  if (showAddressSelection) {
    return (
      <div className="min-h-screen flex flex-col bg-background md:hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddressSelection(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Select Address</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Add New Address */}
          <button
            className="flex items-center gap-3 w-full p-4 border-b border-border text-left"
            onClick={openAddAddress}
          >
            <Plus className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Add New Address</span>
          </button>

          {/* Address List */}
          <div className="space-y-0">
            {addresses.map((addr: Address) => (
              <div key={addr._id} className="border-b border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {addr.isDefault && (
                      <div className="text-xs text-primary font-semibold mb-1">DEFAULT</div>
                    )}
                    <div className="font-semibold text-foreground mb-1">{addr.name}</div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {addr.house}, {addr.area}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {addr.pincode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {addr.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedAddressId === addr._id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => openEditAddress(addr)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                {selectedAddressId !== addr._id && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2 justify-start p-0 h-auto"
                    onClick={() => setSelectedAddressId(addr._id!)}
                  >
                    <div className="w-6 h-6 border-2 border-muted-foreground rounded-full mr-3" />
                    Select this address
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="p-4 border-t border-border">
          <Button
            className="w-full h-12 font-semibold"
            disabled={!selectedAddressId}
            onClick={() => setShowAddressSelection(false)}
          >
            SHIP TO THIS ADDRESS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-4 p-4 border-b border-border">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Pay ₹{finalAmount.toFixed(0)}</h1>
      </div>

      {/* Desktop Navbar/Stepper */}
      <div className="hidden md:block w-full flex items-center justify-center mb-0 bg-background border-b border-border">
        <div className="w-full max-w-6xl flex items-center gap-2 md:gap-6 px-4 md:px-6 py-4">
          <Logo className="h-6 md:h-8 w-auto" />
          <div className="flex-1 flex items-center justify-center gap-2 md:gap-8">
            {['Sign Up', 'Address', 'Payment'].map((label, idx) => (
              <div key={label} className="flex items-center gap-1 md:gap-2">
                <div className={`rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-bold border-2 text-xs md:text-base ${idx === 1 ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}>{idx + 1}</div>
                <span className={`text-xs md:text-base ${idx === 1 ? 'text-primary font-semibold' : 'text-muted-foreground'} hidden sm:inline`}>{label}</span>
                {idx < 2 && <div className="w-4 md:w-8 h-1 bg-muted-foreground rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden flex-1 p-4">
        {/* Address Section */}
        {selectedAddress && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Deliver to {selectedAddress.name}, {selectedAddress.pincode}
            </h2>
            <div className="text-sm text-muted-foreground mb-3">
              <div>{selectedAddress.house}, {selectedAddress.area}</div>
              <div>{selectedAddress.pincode}</div>
              <div>+91-{selectedAddress.phone}</div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddressSelection(true)}
            >
              Change or Add Address
            </Button>
          </div>
        )}

        {!selectedAddress && (
          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddressSelection(true)}
            >
              Select Delivery Address
            </Button>
          </div>
        )}

        {/* Order Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Order Information</h2>

          <div className="bg-card rounded-lg border border-border">
            {/* Price Details Header */}
            <button
              className="w-full p-4 flex items-center justify-between"
              onClick={() => setPriceDetailsExpanded(!priceDetailsExpanded)}
            >
              <div className="text-left">
                <div className="font-semibold text-lg">Price Details</div>
                {savings > 0 && (
                  <div className="text-green-600 text-sm font-semibold">You are saving ₹{savings.toFixed(0)}.</div>
                )}
              </div>
              {priceDetailsExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Expandable Price Breakdown */}
            {priceDetailsExpanded && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bag MRP ({items.length} items)</span>
                    <span className="text-sm font-medium">₹{originalTotal.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bag Discount</span>
                    <span className="text-sm font-medium text-green-600">-₹{savings.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Convenience Charges</span>
                      <Info
                        className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => setConvenienceChargesModalOpen(true)}
                      />
                    </div>
                    <span className="text-sm font-medium">₹{convenienceCharges}</span>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">You Pay</span>
                      <span className="font-bold text-lg">₹{finalAmount.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Content - Original Layout */}
      <div className="hidden md:block flex-1 w-full bg-muted py-6 md:py-10">
        <div className="max-w-6xl mx-auto mb-4 md:mb-6 px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-1">Choose Address</h2>
          <p className="text-muted-foreground text-xs md:text-sm mb-2">Detailed address will help our delivery partner reach your doorstep quickly</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start px-4">
          {/* Address Section */}
          <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6">
              {/* Add New Address Card */}
              <button
                className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground rounded-lg w-full md:min-w-[300px] md:w-auto p-4 md:p-6 min-h-[120px] md:min-h-[180px] cursor-pointer hover:border-primary transition-colors bg-card"
                onClick={openAddAddress}
                type="button"
              >
                <Plus className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground mb-2" />
                <span className="font-semibold text-muted-foreground text-sm md:text-base">Add New Address</span>
              </button>
              {/* Address Cards */}
              {addresses.length === 0 && !loading ? null : addresses.map((addr: Address) => (
                <div key={addr._id} className={`border rounded-lg w-full md:min-w-[300px] md:w-auto bg-card p-4 md:p-6 flex flex-col gap-2 ${selectedAddressId === addr._id ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm md:text-base">{addr.name}</span>
                    {addr.isDefault && <span className="text-xs bg-muted px-2 py-1 rounded font-bold text-primary">DEFAULT</span>}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">{addr.house} {addr.area}<br/>{addr.pincode}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{addr.phone}</div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button size="sm" variant="outline" className="font-semibold text-xs md:text-sm" onClick={() => openEditAddress(addr)}>Edit</Button>
                    <Button size="sm" variant={selectedAddressId === addr._id ? 'default' : 'secondary'} className="font-semibold text-xs md:text-sm" onClick={() => setSelectedAddressId(addr._id!)}>Deliver here</Button>
                  </div>
                </div>
              ))}
              {loading && <div className="text-muted-foreground p-4 md:p-6 text-sm md:text-base">Loading addresses...</div>}
              {error && <div className="text-red-500 p-4 md:p-6 text-sm md:text-base">{error}</div>}
            </div>
          </div>
          {/* Price Details Section */}
          <div className="bg-card rounded-lg border border-border min-w-0 md:min-w-[260px] h-full self-stretch">
            {/* Bag Section */}
            <div className="p-4 md:p-6 border-b border-border">
              <button
                className="w-full flex items-center justify-between"
                onClick={() => setPriceDetailsExpanded(!priceDetailsExpanded)}
              >
                <div className="text-left">
                  <div className="font-bold text-base md:text-lg">Bag</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{items.length} Items</div>
                </div>
                {priceDetailsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {/* Expandable Bag Items */}
              {priceDetailsExpanded && (
                <div className="mt-4 space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-2">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.size && <span>UK {item.size}</span>}
                          {item.color && item.size && <span> • </span>}
                          {item.color && <span>{item.color}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">Quantity : {item.quantity}</span>
                          <div className="text-right">
                            {item.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through mr-2">
                                ₹{parseFloat(item.originalPrice.replace('₹', '')).toFixed(0)}
                              </span>
                            )}
                            <span className="font-semibold">₹{parseFloat(item.price.replace('₹', '')).toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Details Section */}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-sm md:text-base">Price Details</div>
                <div className="text-lg md:text-xl font-bold">₹{finalAmount.toFixed(0)}</div>
              </div>

              {/* Detailed Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Bag MRP ({items.length} items)</span>
                  <span>₹{originalTotal.toFixed(0)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Bag Discount</span>
                  <span className="text-green-600">-₹{savings.toFixed(0)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <span>Convenience Charges</span>
                    <Info
                      className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => setConvenienceChargesModalOpen(true)}
                    />
                  </div>
                  <span>₹{convenienceCharges}</span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">You Pay</span>
                    <span className="font-bold text-lg">₹{finalAmount.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded px-1 py-0.5 mb-4">
                  <div className="text-green-600 text-sm font-semibold text-center">
                    You are saving ₹{savings.toFixed(0)}.
                  </div>
                </div>
              )}

              <Button className="w-full font-bold h-10 md:h-12 text-sm md:text-base" disabled={!selectedAddressId || isPaying} onClick={handleContinueToPayment}>
                {isPaying ? 'Processing...' : 'Continue to Payment'}
              </Button>

              {/* Trust Message */}
              <div className="mt-4 text-center">
                <div className="text-xs text-muted-foreground">
                  Buy authentic products. Pay securely.
                </div>
                <div className="text-xs text-muted-foreground">
                  Easy returns and exchange
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Payment Button */}
      <div className="md:hidden p-4 border-t border-border">
        <Button
          className="w-full font-bold h-12 text-base"
          disabled={!selectedAddressId || isPaying}
          onClick={handleContinueToPayment}
        >
          {isPaying ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </div>

      {/* Manual Payment Verification Section */}
      {paymentCompleted && lastPaymentData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Payment Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your payment was completed but automatic verification failed. You can try manual verification or contact support.
            </p>
            <div className="text-xs text-muted-foreground mb-4 p-3 bg-muted rounded">
              <strong>Order ID:</strong> {lastPaymentData.razorpay_order_id}<br/>
              <strong>Payment ID:</strong> {lastPaymentData.razorpay_payment_id}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={manualVerifyPayment}
                disabled={isPaying}
                className="flex-1"
              >
                {isPaying ? 'Verifying...' : 'Try Again'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPaymentCompleted(false);
                  setLastPaymentData(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              If this continues to fail, please contact support with the above order details.
            </p>
          </div>
        </div>
      )}

      {/* Address Form Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Address' : 'Your Address'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-5">
            {/* PIN code as boxes */}
            <div>
              <label className="block text-sm font-medium mb-1">PIN code</label>
              <div className="flex gap-2">
                {[0,1,2,3,4,5].map(i => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center border rounded bg-background text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.pincode[i] || ''}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '').slice(0,1);
                      let arr = form.pincode.split('');
                      arr[i] = val;
                      setForm(f => ({ ...f, pincode: arr.join('').slice(0,6) }));
                      // Move focus to next box if input
                      if (val && e.target.nextElementSibling) (e.target.nextElementSibling as HTMLInputElement).focus();
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">House / Flat / Office Number</label>
              <Input
                value={form.house}
                onChange={e => setForm(f => ({ ...f, house: e.target.value }))}
                placeholder="e.g. 123A, 2nd Floor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Road Name / Area / Colony</label>
              <Input
                value={form.area}
                onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                placeholder="e.g. MG Road, Green Park"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Use as default address</span>
              <Switch 
                checked={form.isDefault} 
                onCheckedChange={v => setForm(f => ({ ...f, isDefault: v }))} 
                className="bg-muted data-[state=checked]:bg-primary"
              />
            </div>
            <div className="pt-2">
              <div className="font-semibold mb-1">Contact</div>
              <div className="text-xs text-muted-foreground mb-2">Information provided here will be used to contact you for delivery updates.</div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" className="w-full font-bold h-12 text-base mt-2" onClick={handleDialogAction}>{isEdit ? 'Save Changes' : 'Ship to this address'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Convenience Charges Modal */}
      <Dialog open={convenienceChargesModalOpen} onOpenChange={setConvenienceChargesModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Convenience Charges</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Packaging & Delivery Fee */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Packaging & Delivery Fee</span>
                <span className="font-semibold">₹0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ₹70 for orders below ₹499, and ₹20 for orders from ₹499 - ₹999. 'Free' delivery for all orders above ₹999.
              </p>
            </div>

            {/* Platform Fee */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Platform Fee</span>
                <span className="font-semibold">₹29</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Applied to all customers for onboarding the most stylish brands, platform upkeep and customer support. FREE for First Order.
              </p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">₹29</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}