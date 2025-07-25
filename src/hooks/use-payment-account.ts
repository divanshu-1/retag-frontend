'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface PaymentAccount {
  account_number: string;
  ifsc_code: string;
  account_holder: string;
  createdAt?: string;
  updatedAt?: string;
}

export function usePaymentAccount() {
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch payment account
  const fetchPaymentAccount = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('/api/user/payment-account');
      if (response.ok) {
        const data = await response.json();
        setPaymentAccount(data);
      } else {
        console.error('Failed to fetch payment account');
      }
    } catch (error) {
      console.error('Error fetching payment account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save or update payment account
  const savePaymentAccount = async (accountData: Omit<PaymentAccount, 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiRequest('/api/user/payment-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentAccount(data.paymentAccount);
        toast({
          title: 'Success',
          description: 'Payment account updated successfully',
        });
        return true;
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to update payment account',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving payment account:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment account',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete payment account
  const deletePaymentAccount = async () => {
    try {
      const response = await apiRequest('/api/user/payment-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        setPaymentAccount(null);
        toast({
          title: 'Success',
          description: 'Payment account deleted successfully',
        });
        return true;
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to delete payment account',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting payment account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete payment account',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPaymentAccount();
  }, []);

  return {
    paymentAccount,
    isLoading,
    savePaymentAccount,
    deletePaymentAccount,
    refetch: fetchPaymentAccount,
  };
}
