
"use client";

import { useState, Suspense, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, ExternalLink, Loader2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DueDate from "@/components/dashboard/due-date";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { generateReceipt, GenerateReceiptInput } from "@/ai/flows/generate-receipt-flow";
import { useSearchParams } from "next/navigation";
import PaymentDialog from "@/components/dashboard/payment-dialog";
import { add } from "date-fns";

const initialFeeSummary = {
  totalOutstanding: 525000.00,
  nextDueDate: "2024-09-01",
};

const initialFeeBreakdown = [
  { id: 1, description: "Semester Tuition Fee", amount: 450000.00, status: "Outstanding" },
  { id: 2, description: "Library Fee", amount: 15000.00, status: "Outstanding" },
  { id: 3, description: "Lab & Technology Fee", amount: 30000.00, status: "Outstanding" },
  { id: 4, description: "Student Activity Fee", amount: 5000.00, status: "Outstanding" },
  { id: 5, description: "Health & Wellness Fee", amount: 25000.00, status: "Outstanding" },
];

const initialPaymentHistory = [
    { id: "TXN1001", date: "2024-01-15", description: "Spring Semester Fees", amount: 525000.00, method: "Online Transfer" },
    { id: "TXN1002", date: "2023-08-20", description: "Fall Semester Fees", amount: 515000.00, method: "Credit Card" },
    { id: "TXN1003", date: "2023-01-12", description: "Spring Semester Fees", amount: 515000.00, method: "Online Transfer" },
];

type PaymentHistory = typeof initialPaymentHistory[0];

function FeesPageContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || "Alex Johnson";
  const studentId = "CS2023001";

  const [isLoading, setIsLoading] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const [feeSummary, setFeeSummary] = useState(initialFeeSummary);
  const [feeBreakdown, setFeeBreakdown] = useState(initialFeeBreakdown);
  const [paymentHistory, setPaymentHistory] = useState(initialPaymentHistory);

  const receiptRef = useRef<HTMLDivElement>(null);


  const handleDownload = async (payment: PaymentHistory) => {
    setIsLoading(true);
    toast({
      title: "Generating Your Receipt...",
      description: `The AI is creating a receipt for transaction ${payment.id}. Please wait.`,
    });

    try {
      const input: GenerateReceiptInput = {
        transactionId: payment.id,
        date: payment.date,
        description: payment.description,
        amount: payment.amount,
        method: payment.method,
        studentName: name,
        studentId: studentId,
      };
      const result = await generateReceipt(input);
      setGeneratedReceipt(result.receiptText);
      setIsReceiptDialogOpen(true);
    } catch (error) {
      console.error("Receipt generation failed:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI failed to generate a receipt. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = (method: string) => {
    setIsPaymentDialogOpen(false);
    toast({
      title: "Processing Payment...",
      description: `Your payment via ${method} is being processed.`,
    });

    setTimeout(() => {
        const amountPaid = feeSummary.totalOutstanding;
        toast({
            title: "Payment Successful!",
            description: `Successfully paid ₹${new Intl.NumberFormat('en-IN').format(amountPaid)} via ${method}.`,
        });

        // Add to payment history
        const newPayment: PaymentHistory = {
            id: `TXN${Math.floor(Math.random() * 9000) + 1000}`,
            date: new Date().toISOString().split('T')[0],
            description: "Fall Semester Fees",
            amount: amountPaid,
            method: method,
        };
        setPaymentHistory([newPayment, ...paymentHistory]);
        
        // Update fee breakdown
        setFeeBreakdown(feeBreakdown.map(item => ({ ...item, status: 'Paid' })));

        // Update summary
        setFeeSummary({
            totalOutstanding: 0.00,
            nextDueDate: add(new Date(feeSummary.nextDueDate), { months: 6 }).toISOString().split('T')[0],
        });

    }, 2000);
  };
  
  const handlePrint = () => {
    const printContents = receiptRef.current?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              body { font-family: monospace; line-height: 1.6; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
      printWindow?.close();
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Fee Management</CardTitle>
              <CardDescription>View your fee details, outstanding payments, and payment history.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 bg-primary/5 text-primary-foreground border-primary/20">
            <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                Outstanding Balance
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold text-primary">₹{new Intl.NumberFormat('en-IN').format(feeSummary.totalOutstanding)}</p>
                {feeSummary.totalOutstanding > 0 && (
                    <p className="text-sm text-primary/80 mt-1">
                        Next payment due on <DueDate date={feeSummary.nextDueDate} />
                    </p>
                )}
            </CardContent>
            {feeSummary.totalOutstanding > 0 && (
                <CardFooter>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            Pay Now <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                </CardFooter>
            )}
            </Card>

            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Current Fee Breakdown</CardTitle>
                    <CardDescription>Itemized list of charges for the current semester.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {feeBreakdown.map((item) => (
                            <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-right font-mono">₹{new Intl.NumberFormat('en-IN').format(item.amount)}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={item.status === 'Paid' ? 'secondary' : 'destructive'} className={item.status === 'Paid' ? 'bg-green-600/10 text-green-700 border-green-600/20' : ''}>{item.status}</Badge>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                    <CardFooter className="justify-end border-t pt-4">
                        <div className="flex items-center gap-4 text-right">
                            <span className="text-muted-foreground">Total</span>
                            <span className="text-xl font-bold">₹{new Intl.NumberFormat('en-IN').format(feeSummary.totalOutstanding)}</span>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
        <DialogContent>
            <PaymentDialog amount={feeSummary.totalOutstanding} onPaymentSelect={handlePayment} />
        </DialogContent>
      </Dialog>


      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>A record of your past transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-muted-foreground">{payment.id}</TableCell>
                  <TableCell><DueDate date={payment.date} /></TableCell>
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right font-mono">₹{new Intl.NumberFormat('en-IN').format(payment.amount)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="icon" onClick={() => handleDownload(payment)} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Download className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generated Receipt</DialogTitle>
            <DialogDescription>
              Here is the AI-generated receipt for your transaction.
            </DialogDescription>
          </DialogHeader>
          {generatedReceipt && (
            <div ref={receiptRef} className="mt-4 bg-muted/50 p-4 rounded-md border">
                <pre className="whitespace-pre-wrap text-sm font-mono">{generatedReceipt}</pre>
            </div>
          )}
           <DialogFooter>
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FeesPage() {
    return (
        <Suspense fallback={<div>Loading fees...</div>}>
            <FeesPageContent />
        </Suspense>
    )
}

    