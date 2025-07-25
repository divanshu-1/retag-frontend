'use client';

import { useState } from 'react';
import { usePaymentAccount } from '@/hooks/use-payment-account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { View } from '@/app/page';

export default function PaymentView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { paymentAccount, savePaymentAccount, deletePaymentAccount, isLoading: isLoadingPaymentAccount } = usePaymentAccount();
  const { toast } = useToast();

  // Payment account editing state
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    account_number: '',
    ifsc_code: '',
    account_holder: ''
  });

  const handleEditPaymentAccount = () => {
    if (paymentAccount) {
      setPaymentFormData({
        account_number: paymentAccount.account_number,
        ifsc_code: paymentAccount.ifsc_code,
        account_holder: paymentAccount.account_holder
      });
    }
    setIsEditingPayment(true);
  };

  const handleSavePaymentAccount = async () => {
    if (!paymentFormData.account_number || !paymentFormData.ifsc_code || !paymentFormData.account_holder) {
      toast({
        title: 'Error',
        description: 'Please fill in all payment account fields.',
        variant: 'destructive'
      });
      return;
    }

    const success = await savePaymentAccount(paymentFormData);
    if (success) {
      setIsEditingPayment(false);
      setPaymentFormData({ account_number: '', ifsc_code: '', account_holder: '' });
    }
  };

  const handleDeletePaymentAccount = async () => {
    const success = await deletePaymentAccount();
    if (success) {
      setIsEditingPayment(false);
      setPaymentFormData({ account_number: '', ifsc_code: '', account_holder: '' });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPayment(false);
    setPaymentFormData({ account_number: '', ifsc_code: '', account_holder: '' });
  };

  return (
    <div className="bg-[#18181b] min-h-screen pt-24 pb-20">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('account')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Account</h1>
            <p className="text-muted-foreground">Manage your account for receiving payments from selling items</p>
          </div>
        </div>

        {/* Payment Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Bank Account Details
            </CardTitle>
            <CardDescription>
              This account will be used to receive payments when you sell items on ReTag
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingPaymentAccount ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="ml-3 text-sm text-muted-foreground">Loading payment account...</p>
              </div>
            ) : paymentAccount && !isEditingPayment ? (
              // Display existing payment account
              <div className="space-y-6">
                <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Holder Name</Label>
                    <p className="text-lg font-semibold mt-1">{paymentAccount.account_holder}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Number</Label>
                    <p className="text-lg font-mono mt-1">****{paymentAccount.account_number.slice(-4)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">IFSC Code</Label>
                    <p className="text-lg font-mono mt-1">{paymentAccount.ifsc_code}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleEditPaymentAccount} className="flex-1">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Account
                  </Button>
                  <Button variant="outline" onClick={handleDeletePaymentAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              // Form to add/edit payment account
              <div className="space-y-6">
                {paymentAccount && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      You're updating your existing payment account. Changes will apply to all future transactions.
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="payment-account-holder">Account Holder Name *</Label>
                    <Input
                      id="payment-account-holder"
                      placeholder="Enter account holder name"
                      value={paymentFormData.account_holder}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, account_holder: e.target.value }))}
                      autoComplete="off"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-account-number">Account Number *</Label>
                    <Input
                      id="payment-account-number"
                      placeholder="Enter account number"
                      value={paymentFormData.account_number}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, account_number: e.target.value }))}
                      autoComplete="off"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-ifsc">IFSC Code *</Label>
                    <Input
                      id="payment-ifsc"
                      placeholder="Enter IFSC code"
                      value={paymentFormData.ifsc_code}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                      autoComplete="off"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleSavePaymentAccount} className="flex-1">
                    {paymentAccount ? 'Update Account' : 'Save Account'}
                  </Button>
                  {paymentAccount && (
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> This account will be used for all payment receipts from selling items. 
                    Make sure the details are correct as payments will be transferred to this account.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
