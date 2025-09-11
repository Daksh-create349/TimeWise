
"use client";

import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Landmark, Loader2 } from "lucide-react";
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentDialogProps {
  amount: number;
  onPaymentSelect: (method: string) => void;
}

const GPayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M103.522 106.347H55.703v43.306h47.82v-43.306z" fill="#34A853"/>
    <path d="M189.96 55.703c-18.45-18.45-44.532-29.61-73.916-29.61-49.034 0-90.007 33.208-103.522 78.433l49.034 19.057c5.15-13.568 18.262-23.493 33.208-23.493 11.238 0 21.365 5.337 27.534 13.568l-27.534 27.346h75.59v-88.7z" fill="#4285F4"/>
    <path d="M116.044 229.907c19.057 0 36.72-5.71 51.28-15.82l-40.976-31.533c-6.824 4.59-15.26 7.2-24.46 7.2-19.616 0-36.16-13.4-41.53-31.533l-49.034 18.87c13.755 45.225 55.22 76.816 104.72 76.816z" fill="#FBBC04"/>
    <path d="M189.96 156.47c10.49-14.73 16.417-32.65 16.417-51.28 0-11.425-2.285-22.477-6.28-32.36l-47.26 36.72c10.3 11.05 10.3 27.908 0 38.958-9.927 10.677-26.255 11.05-36.533.95l-4.773 4.773c5.337 4.59 11.797 8.146 18.87 10.676l49.59-38.4z" fill="#EA4335"/>
  </svg>
);

const RazorpayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.3844 22.3364L19.063 15.1119L24.8569 8.64795H17.4326L14.1112 14.5929L12.3383 11.834H18.7909L14.1112 4.39844H4.39746L11.5522 15.5532L8.23079 22.3364H15.6551L18.9765 16.3255L20.7494 19.0844L14.1112 28L24.8569 15.1119L28 22.3364H22.3844ZM8.74987 8.64795H14.1112L11.0338 13.2844L8.74987 8.64795Z" fill="#528FF0"/>
    </svg>
);


export default function PaymentDialog({ amount, onPaymentSelect }: PaymentDialogProps) {
  const [activeTab, setActiveTab] = useState("upi");
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = (method: string) => {
    setIsLoading(true);
    onPaymentSelect(method);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">Complete Your Payment</DialogTitle>
        <DialogDescription>
          You are paying a total of <span className="font-bold text-primary">₹{new Intl.NumberFormat('en-IN').format(amount)}</span>.
          Choose your preferred payment method below.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="upi" className="w-full mt-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upi">UPI & Wallets</TabsTrigger>
          <TabsTrigger value="card">Cards & Netbanking</TabsTrigger>
        </TabsList>

        <TabsContent value="upi">
          <div className="space-y-4 py-4">
             <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handlePay("GPay")}
            >
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <GPayIcon />
                        <span className="font-semibold">GPay / Google Pay</span>
                    </div>
                    <Button variant="ghost" size="sm">Pay Now</Button>
                </CardContent>
            </Card>
            <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handlePay("Razorpay")}
            >
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <RazorpayIcon />
                        <span className="font-semibold">Razorpay</span>
                    </div>
                    <Button variant="ghost" size="sm">Pay Now</Button>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="card">
            <div className="space-y-4 py-4">
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className='flex items-center gap-2 text-sm font-medium'>
                            <CreditCard className='w-5 h-5'/>
                            Credit/Debit Card
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry</Label>
                                <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name on Card</Label>
                                <Input id="name" placeholder="Alex Johnson" />
                            </div>
                        </div>
                         <Button className="w-full" onClick={() => handlePay("Credit Card")}>
                            Pay with Card
                        </Button>
                    </CardContent>
                </Card>
                 <Card 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handlePay("Netbanking")}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Landmark className="w-5 h-5"/>
                            <span className="font-semibold">Netbanking</span>
                        </div>
                        <Button variant="ghost" size="sm">Pay Now</Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        {isLoading && (
            <div className="flex items-center justify-center w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing your payment...</span>
            </div>
        )}
      </DialogFooter>
    </>
  );
}
