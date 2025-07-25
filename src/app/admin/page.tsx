"use client";
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard, CheckCircle, XCircle, Loader2, ArrowLeft, CreditCard, Copy, Eye, EyeOff, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactManagement from '@/components/admin/contact-management';

interface SellerRequest {
  _id: string;
  article: string;
  brand: string;
  ai_analysis: any;
  seller: {
    name: string;
    email: string;
    phone?: string;
    paymentAccount?: {
      account_number: string;
      ifsc_code: string;
      account_holder: string;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  status: string;
  created_at: string;
  images?: string[];
  listed_product?: {
    price?: number;
    mrp?: number;
    discount_percentage?: number;
    // add other fields if needed
  };
  admin_review?: {
    final_price?: number;
    mrp?: number;
    discount_percentage?: number;
    pricing_type?: 'fixed' | 'percentage';
    // add other fields if needed
  };
}

export default function AdminDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const isAdmin = user?.email === 'retagcontact00@gmail.com';
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [finalPrices, setFinalPrices] = useState<{ [id: string]: string }>({});
  const [mrpPrices, setMrpPrices] = useState<{ [id: string]: string }>({});
  const [discountPercentages, setDiscountPercentages] = useState<{ [id: string]: string }>({});
  const [pricingTypes, setPricingTypes] = useState<{ [id: string]: 'fixed' | 'percentage' }>({});
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'requests' | 'listed' | 'contact'>('requests');
  const [listed, setListed] = useState<SellerRequest[]>([]);
  const [listedLoading, setListedLoading] = useState(false);
  const [listedError, setListedError] = useState('');
  const [visiblePaymentDetails, setVisiblePaymentDetails] = useState<{ [id: string]: boolean }>({});
  const [editingProduct, setEditingProduct] = useState<SellerRequest | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Helper functions for payment details
  const togglePaymentVisibility = (id: string) => {
    setVisiblePaymentDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard!',
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditProduct = (product: SellerRequest) => {
    setEditingProduct(product);
    const currentPrice = product.listed_product?.price || product.admin_review?.final_price || 0;
    const currentMrp = product.listed_product?.mrp || product.admin_review?.mrp || 0;
    setEditPrice(currentPrice.toString());
    setEditMrp(currentMrp.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/sell/admin/products/${editingProduct._id}/edit-price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          price: parseFloat(editPrice),
          mrp: parseFloat(editMrp)
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product price updated successfully"
        });
        setEditingProduct(null);
        fetchListed(); // Refresh the list
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to update product price",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product price",
        variant: "destructive"
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Payment Details Component
  const PaymentDetailsCard = ({ seller, productId }: { seller: SellerRequest['seller'], productId: string }) => {
    const paymentAccount = seller.paymentAccount;
    const isVisible = visiblePaymentDetails[productId];

    if (!paymentAccount) {
      return (
        <div className="bg-slate-800 border border-amber-500 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">No Payment Account</span>
          </div>
          <p className="text-xs text-amber-200 mt-1">Seller hasn't set up payment account yet</p>
        </div>
      );
    }

    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">Payment Account</span>
          </div>
          <button
            onClick={() => togglePaymentVisibility(productId)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {isVisible && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-blue-300 font-medium">Account Holder:</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-mono bg-slate-700 text-slate-100 px-2 py-1 rounded border border-slate-600">{paymentAccount.account_holder}</span>
                  <button
                    onClick={() => copyToClipboard(paymentAccount.account_holder, 'Account holder name')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-blue-300 font-medium">IFSC Code:</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-mono bg-slate-700 text-slate-100 px-2 py-1 rounded border border-slate-600">{paymentAccount.ifsc_code}</span>
                  <button
                    onClick={() => copyToClipboard(paymentAccount.ifsc_code, 'IFSC code')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <span className="text-blue-300 font-medium text-xs">Account Number:</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-mono bg-slate-700 text-slate-100 px-2 py-1 rounded border border-slate-600 text-sm">{paymentAccount.account_number}</span>
                <button
                  onClick={() => copyToClipboard(paymentAccount.account_number, 'Account number')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    fetch('http://localhost:8080/sell/admin/pending', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setRequests(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch seller requests.');
        setLoading(false);
      });
  }, [isAdmin]);

  // 1. Add a function to fetch listed products
  const fetchListed = async () => {
    setListedLoading(true);
    setListedError('');
    try {
      const res = await fetch('http://localhost:8080/sell/admin/listed', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setListed(data.products || []);
      setListedLoading(false);
    } catch {
      setListedError('Failed to fetch listed products.');
      setListedLoading(false);
    }
  };

  // 2. Refetch listed products after publish/unlist, and on tab switch
  useEffect(() => {
    if (!isAdmin || tab !== 'listed') return;
    fetchListed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, tab]);

  // After requests are loaded, pre-fill finalPrices with AI price if not already set
  useEffect(() => {
    if (!loading && requests.length > 0) {
      setFinalPrices(fp => {
        const updated = { ...fp };
        requests.forEach(req => {
          const aiPrice = req.ai_analysis?.price_suggestion?.suggested_price || '';
          if (updated[req._id] === undefined || updated[req._id] === '') {
            updated[req._id] = aiPrice ? String(aiPrice) : '';
          }
        });
        return updated;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, requests]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id + action);
    setError('');
    try {
      const body: any = { action };
      if (action === 'approve') {
        const finalPrice = parseFloat(finalPrices[id]);
        const pricingType = pricingTypes[id] || 'fixed';

        if (!finalPrice || finalPrice <= 0) {
          setError('Please enter a valid final price.');
          setActionLoading(null);
          return;
        }

        body.final_price = finalPrice;
        body.pricing_type = pricingType;

        if (pricingType === 'percentage') {
          const discountPercent = parseFloat(discountPercentages[id]);
          if (!discountPercent || discountPercent < 0 || discountPercent > 100) {
            setError('Please enter a valid discount percentage (0-100).');
            setActionLoading(null);
            return;
          }
          // Calculate MRP from final price and discount percentage
          const mrp = Math.round(finalPrice / (1 - discountPercent / 100));
          body.mrp = mrp;
          body.discount_percentage = discountPercent;
        } else {
          // Fixed pricing - MRP is optional
          const mrp = parseFloat(mrpPrices[id]);
          if (mrp && mrp > 0) {
            if (mrp < finalPrice) {
              setError('MRP cannot be less than the final price.');
              setActionLoading(null);
              return;
            }
            body.mrp = mrp;
            body.discount_percentage = Math.round(((mrp - finalPrice) / mrp) * 100);
          }
        }
      }

      const res = await fetch(`http://localhost:8080/sell/admin/review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to update product');
      setRequests(reqs => reqs.filter(r => r._id !== id));
      if (action === 'approve') {
        fetchListed(); // Refetch published products after publish
      }
    } catch (e) {
      setError('Failed to update product.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlist = async (id: string) => {
    setActionLoading(id + 'unlist');
    setListedError('');
    try {
      const res = await fetch(`http://localhost:8080/sell/admin/review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action: 'reject', admin_notes: 'Unlisted by admin' })
      });
      if (!res.ok) throw new Error('Failed to unlist product');
      fetchListed(); // Refetch published products after unlist
    } catch (e) {
      setListedError('Failed to unlist product.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = () => {
    if (confirmAction) {
      handleAction(confirmAction.id, confirmAction.action);
      setConfirmAction(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.seller?.email?.toLowerCase().includes(search.toLowerCase()) ||
      req.brand?.toLowerCase().includes(search.toLowerCase()) ||
      req.article?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            className="p-2 rounded-full hover:bg-muted transition"
            aria-label="Back to Account"
            onClick={() => { window.location.hash = 'account'; }}
          >
            <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          </button>
          <LayoutDashboard className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary">Admin Dashboard</h1>
        </div>
        <Tabs value={tab} onValueChange={(val) => setTab(val as 'requests' | 'listed' | 'contact')} className="mb-6 sm:mb-8">
          <TabsList className="bg-white w-full sm:w-auto">
            <TabsTrigger value="requests" className="text-xs sm:text-sm text-black data-[state=active]:bg-primary data-[state=active]:text-white flex-1 sm:flex-none">Seller Requests</TabsTrigger>
            <TabsTrigger value="listed" className="text-xs sm:text-sm text-black data-[state=active]:bg-primary data-[state=active]:text-white flex-1 sm:flex-none">Published Products</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm text-black data-[state=active]:bg-primary data-[state=active]:text-white flex-1 sm:flex-none">Contact Management</TabsTrigger>
          </TabsList>
        </Tabs>
        {tab === 'requests' && (
          <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Seller Requests</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by seller email, brand, or article..."
                className="border rounded px-3 py-2 w-full sm:w-80 text-sm text-black bg-white placeholder:text-gray-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-6 w-6" /> Loading seller requests...</div>
            ) : error ? (
              <div className="text-destructive mb-4">{error}</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-muted-foreground">No seller requests pending review.</div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredRequests.map(req => {
                  const firstImage = req.images && req.images.length > 0 ? req.images[0] : null;
                  const imageUrl = firstImage ? (firstImage.startsWith('http') ? firstImage : `http://localhost:8080/${firstImage.replace(/^uploads\//, 'uploads/')}`) : null;
                  const aiPrice = req.ai_analysis?.price_suggestion?.suggested_price || '';
                  return (
                    <div key={req._id} className="p-4 sm:p-6 rounded-lg bg-muted flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt="Product" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border bg-background" />
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-lg border bg-background text-muted-foreground text-xs">No Image</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base sm:text-lg mb-1">{req.brand} {req.article}</div>
                          <div className="text-sm text-muted-foreground mb-1">Seller: {req.seller?.name || 'Unknown'} ({req.seller?.email})</div>
                          <div className="text-sm text-muted-foreground mb-1">Status: <span className="text-yellow-600 font-bold">{req.status}</span></div>
                          <div className="text-xs text-muted-foreground mb-1">Submitted: {new Date(req.created_at).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground mb-3">AI Suggested Price: ₹{aiPrice || 'N/A'}</div>

                          {/* Pricing Controls */}
                          <div className="bg-background/50 p-4 rounded-lg mb-4">
                            <div className="flex flex-col sm:flex-row gap-3 mb-3">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`pricing-${req._id}`}
                                  checked={(pricingTypes[req._id] || 'fixed') === 'fixed'}
                                  onChange={() => setPricingTypes(prev => ({ ...prev, [req._id]: 'fixed' }))}
                                  className="text-primary"
                                />
                                <span className="text-sm font-medium">Fixed Pricing</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`pricing-${req._id}`}
                                  checked={pricingTypes[req._id] === 'percentage'}
                                  onChange={() => setPricingTypes(prev => ({ ...prev, [req._id]: 'percentage' }))}
                                  className="text-primary"
                                />
                                <span className="text-sm font-medium">Percentage Discount</span>
                              </label>
                            </div>

                            {(pricingTypes[req._id] || 'fixed') === 'fixed' ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">Final Price *</label>
                                  <input
                                    type="number"
                                    step="50"
                                    placeholder="Final selling price"
                                    className="border rounded px-3 py-2 w-full text-sm text-black bg-white placeholder:text-gray-500"
                                    value={finalPrices[req._id] || ''}
                                    onChange={e => {
                                      let val = e.target.value;
                                      if (val === '') val = aiPrice ? String(aiPrice) : '';
                                      setFinalPrices(fp => ({ ...fp, [req._id]: val }));
                                    }}
                                    disabled={actionLoading !== null}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">MRP (Optional)</label>
                                  <input
                                    type="number"
                                    step="50"
                                    placeholder="Maximum retail price"
                                    className="border rounded px-3 py-2 w-full text-sm text-black bg-white placeholder:text-gray-500"
                                    value={mrpPrices[req._id] || ''}
                                    onChange={e => setMrpPrices(prev => ({ ...prev, [req._id]: e.target.value }))}
                                    disabled={actionLoading !== null}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">Final Price *</label>
                                  <input
                                    type="number"
                                    step="50"
                                    placeholder="Final selling price"
                                    className="border rounded px-3 py-2 w-full text-sm text-black bg-white placeholder:text-gray-500"
                                    value={finalPrices[req._id] || ''}
                                    onChange={e => {
                                      let val = e.target.value;
                                      if (val === '') val = aiPrice ? String(aiPrice) : '';
                                      setFinalPrices(fp => ({ ...fp, [req._id]: val }));
                                    }}
                                    disabled={actionLoading !== null}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">Discount % *</label>
                                  <input
                                    type="number"
                                    step="5"
                                    min="0"
                                    max="100"
                                    placeholder="Discount percentage"
                                    className="border rounded px-3 py-2 w-full text-sm text-black bg-white placeholder:text-gray-500"
                                    value={discountPercentages[req._id] || ''}
                                    onChange={e => setDiscountPercentages(prev => ({ ...prev, [req._id]: e.target.value }))}
                                    disabled={actionLoading !== null}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Price Preview */}
                            {finalPrices[req._id] && (
                              <div className="mt-3 p-2 bg-muted/30 rounded text-xs">
                                <span className="text-muted-foreground">Preview: </span>
                                {(pricingTypes[req._id] === 'percentage' && discountPercentages[req._id]) ? (
                                  <>
                                    <span className="line-through text-muted-foreground">
                                      ₹{Math.round(parseFloat(finalPrices[req._id]) / (1 - parseFloat(discountPercentages[req._id] || '0') / 100))}
                                    </span>
                                    <span className="ml-2 font-bold text-primary">₹{finalPrices[req._id]}</span>
                                    <span className="ml-2 text-green-600">({discountPercentages[req._id]}% off)</span>
                                  </>
                                ) : mrpPrices[req._id] && parseFloat(mrpPrices[req._id]) > parseFloat(finalPrices[req._id]) ? (
                                  <>
                                    <span className="line-through text-muted-foreground">₹{mrpPrices[req._id]}</span>
                                    <span className="ml-2 font-bold text-primary">₹{finalPrices[req._id]}</span>
                                    <span className="ml-2 text-green-600">
                                      ({Math.round(((parseFloat(mrpPrices[req._id]) - parseFloat(finalPrices[req._id])) / parseFloat(mrpPrices[req._id])) * 100)}% off)
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-bold text-primary">₹{finalPrices[req._id]}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Payment Details for Money Transfer */}
                          <PaymentDetailsCard seller={req.seller} productId={req._id} />

                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-60 flex-1"
                              disabled={actionLoading !== null}
                              onClick={() => setConfirmAction({ id: req._id, action: 'approve' })}
                            >
                              {actionLoading === req._id + 'approve' ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle className="h-5 w-5" />} Publish
                            </button>
                            <button
                              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-destructive/90 transition disabled:opacity-60 flex-1"
                              disabled={actionLoading !== null}
                              onClick={() => setConfirmAction({ id: req._id, action: 'reject' })}
                            >
                              {actionLoading === req._id + 'reject' ? <Loader2 className="animate-spin h-5 w-5" /> : <XCircle className="h-5 w-5" />} Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === 'listed' && (
          <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Published Products</h2>
            {listedLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-6 w-6" /> Loading published products...</div>
            ) : listedError ? (
              <div className="text-destructive mb-4">{listedError}</div>
            ) : listed.length === 0 ? (
              <div className="text-muted-foreground">No published products.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {listed.map(req => {
                  // Show up to 4 images
                  const images = (req.images || []).slice(0, 4);
                  const imageUrls = images.map(img => img.startsWith('http') ? img : `http://localhost:8080/${img.replace(/^uploads\//, 'uploads/')}`);
                  const caption = req.ai_analysis?.image_analysis?.caption || '';
                  const price = req.listed_product?.price || req.admin_review?.final_price || 0;
                  const mrp = req.listed_product?.mrp || req.admin_review?.mrp;
                  const discountPercent = req.listed_product?.discount_percentage || req.admin_review?.discount_percentage;

                  return (
                    <div key={req._id} className="p-4 sm:p-6 rounded-lg bg-muted flex flex-col gap-4 shadow-md">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {imageUrls.length > 0 ? (
                          imageUrls.map((url, idx) => (
                            <img key={idx} src={url} alt="Product" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border bg-background" />
                          ))
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg border bg-background text-muted-foreground text-xs">No Image</div>
                        )}
                      </div>
                      <div className="font-semibold text-lg mb-1">{req.brand} {req.article}</div>
                      <div className="text-sm text-muted-foreground mb-1">Seller: {req.seller?.name || 'Unknown'} ({req.seller?.email})</div>
                      <div className="text-sm text-muted-foreground mb-1">Status: <span className="text-green-600 font-bold">{req.status}</span></div>
                      <div className="text-xs text-muted-foreground mb-1">Published: {new Date(req.created_at).toLocaleString()}</div>

                      {/* Enhanced Price Display */}
                      <div className="mb-2">
                        {mrp && mrp > price ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground line-through">₹{mrp}</span>
                            <span className="text-lg font-bold text-primary">₹{price}</span>
                            {discountPercent && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                {Math.round(discountPercent)}% OFF
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-primary">₹{price}</div>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground mb-2 italic line-clamp-2">{caption}</div>

                      {/* Payment Details for Money Transfer */}
                      <PaymentDetailsCard seller={req.seller} productId={req._id} />

                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 w-full sm:w-auto"
                          disabled={actionLoading !== null}
                          onClick={() => handleEditProduct(req)}
                        >
                          <Edit className="h-5 w-5" /> Edit
                        </button>
                        <button
                          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-destructive/90 transition disabled:opacity-60 w-full sm:w-auto"
                          disabled={actionLoading !== null}
                          onClick={() => handleUnlist(req._id)}
                        >
                          {actionLoading === req._id + 'unlist' ? <Loader2 className="animate-spin h-5 w-5" /> : <XCircle className="h-5 w-5" />} Unlist
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === 'contact' && (
          <ContactManagement />
        )}
      </div>
      <Dialog open={!!confirmAction} onOpenChange={open => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.action === 'approve' ? 'Publish Product' : 'Reject Product'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {confirmAction?.action === 'approve'
              ? 'Are you sure you want to publish this product to the store?'
              : 'Are you sure you want to reject this product? This action cannot be undone.'}
          </div>
          <DialogFooter>
            <button className="px-4 py-2 rounded bg-muted text-foreground" onClick={() => setConfirmAction(null)}>Cancel</button>
            <button
              className={confirmAction?.action === 'approve' ? 'px-4 py-2 rounded bg-primary text-primary-foreground font-bold ml-2' : 'px-4 py-2 rounded bg-destructive text-destructive-foreground font-bold ml-2'}
              onClick={handleConfirm}
            >
              {confirmAction?.action === 'approve' ? 'Publish' : 'Reject'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={!!editingProduct} onOpenChange={open => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Price</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">Product: {editingProduct?.brand} {editingProduct?.article}</label>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">Selling Price (₹)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                placeholder="Enter selling price"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">MRP (₹)</label>
              <input
                type="number"
                value={editMrp}
                onChange={(e) => setEditMrp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                placeholder="Enter MRP"
              />
            </div>
            {editMrp && editPrice && parseFloat(editMrp) > parseFloat(editPrice) && (
              <div className="text-sm text-green-600">
                Discount: {Math.round(((parseFloat(editMrp) - parseFloat(editPrice)) / parseFloat(editMrp)) * 100)}% OFF
              </div>
            )}
          </div>
          <DialogFooter>
            <button
              className="px-4 py-2 rounded bg-muted text-foreground"
              onClick={() => setEditingProduct(null)}
              disabled={editLoading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-bold ml-2 disabled:opacity-50"
              onClick={handleSaveEdit}
              disabled={editLoading || !editPrice}
            >
              {editLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}