
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const feeSummary = {
  totalOutstanding: 525000.00,
  nextDueDate: "2024-09-01",
};

const feeBreakdown = [
  { id: 1, description: "Semester Tuition Fee", amount: 450000.00, status: "Outstanding" },
  { id: 2, description: "Library Fee", amount: 15000.00, status: "Outstanding" },
  { id: 3, description: "Lab & Technology Fee", amount: 30000.00, status: "Outstanding" },
  { id: 4, description: "Student Activity Fee", amount: 5000.00, status: "Outstanding" },
  { id: 5, description: "Health & Wellness Fee", amount: 25000.00, status: "Outstanding" },
];

const paymentHistory = [
    { id: "TXN1001", date: "2024-01-15", description: "Spring Semester Fees", amount: 525000.00, method: "Online Transfer" },
    { id: "TXN1002", date: "2023-08-20", description: "Fall Semester Fees", amount: 515000.00, method: "Credit Card" },
    { id: "TXN1003", date: "2023-01-12", description: "Spring Semester Fees", amount: 515000.00, method: "Online Transfer" },
];


export default function FeesPage() {
  const { toast } = useToast();

  const handleDownload = (transactionId: string) => {
    toast({
      title: "Downloading Receipt",
      description: `Your receipt for transaction ${transactionId} is downloading.`,
    });
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
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-primary/5 text-primary-foreground border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-primary">₹{new Intl.NumberFormat('en-IN').format(feeSummary.totalOutstanding)}</p>
            <p className="text-sm text-primary/80 mt-1">
              Next payment due on {new Date(feeSummary.nextDueDate).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Pay Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
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
                            <Badge variant={item.status === 'Paid' ? 'secondary' : 'destructive'}>{item.status}</Badge>
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
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right font-mono">₹{new Intl.NumberFormat('en-IN').format(payment.amount)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="icon" onClick={() => handleDownload(payment.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
