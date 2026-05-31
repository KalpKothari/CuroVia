"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  User,
  DollarSign,
  Mail,
  Stethoscope,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { approvePayout } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

export function PendingPayouts({ payouts }) {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const { loading, data, fn: submitApproval } = useFetch(approvePayout);

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
  };

  const handleApprovePayout = (payout) => {
    setSelectedPayout(payout);
    setShowApproveDialog(true);
  };

  const confirmApproval = async () => {
    if (!selectedPayout || loading) return;
    const formData = new FormData();
    formData.append("payoutId", selectedPayout.id);
    await submitApproval(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowApproveDialog(false);
      setSelectedPayout(null);
      toast.success("Payout approved successfully!");
    }
  }, [data]);

  const closeDialogs = () => {
    setSelectedPayout(null);
    setShowApproveDialog(false);
  };

  return (
    <div className="w-full">
      <Card className="bg-muted/20 border-emerald-900/20">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-white">
            Pending Payouts
          </CardTitle>
          <CardDescription className="text-sm">
            Review and approve doctor payout requests
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              No pending payout requests at this time.
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {payouts.map((payout) => (
                <Card
                  key={payout.id}
                  className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Doctor info row */}
                      <div className="flex items-start gap-3">
                        <div className="bg-muted/20 rounded-full p-2 mt-0.5 flex-shrink-0">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm sm:text-base truncate">
                            Dr. {payout.doctor.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {payout.doctor.specialty}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                              <span>
                                {payout.credits} credits &bull; ${payout.netAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 min-w-0">
                              <Mail className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                              <span className="truncate text-xs">
                                {payout.paypalEmail}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested{" "}
                            {format(
                              new Date(payout.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex flex-row items-center justify-between gap-2 pt-1 border-t border-emerald-900/10">
                        <Badge
                          variant="outline"
                          className="bg-amber-900/20 border-amber-900/30 text-amber-400 text-xs"
                        >
                          Pending
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(payout)}
                            className="border-emerald-900/30 hover:bg-muted/80 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprovePayout(payout)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Details Dialog */}
      {selectedPayout && !showApproveDialog && (
        <Dialog open={!!selectedPayout} onOpenChange={closeDialogs}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                Payout Request Details
              </DialogTitle>
              <DialogDescription className="text-sm">
                Review the payout request information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3 sm:py-4">
              {/* Doctor Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  <h3 className="text-white font-medium text-sm sm:text-base">Doctor Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-white text-sm sm:text-base">Dr. {selectedPayout.doctor.name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-white text-sm sm:text-base break-all">{selectedPayout.doctor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Specialty</p>
                    <p className="text-white text-sm sm:text-base">{selectedPayout.doctor.specialty}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Current Credits</p>
                    <p className="text-white text-sm sm:text-base">{selectedPayout.doctor.credits}</p>
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  <h3 className="text-white font-medium text-sm sm:text-base">Payout Details</h3>
                </div>
                <div className="bg-muted/20 p-3 sm:p-4 rounded-lg border border-emerald-900/20 space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Credits to pay out:</span>
                    <span className="text-white font-medium">{selectedPayout.credits}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Gross amount (10 USD/credit):</span>
                    <span className="text-white">${selectedPayout.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Platform fee (2 USD/credit):</span>
                    <span className="text-white">-${selectedPayout.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-emerald-900/20 pt-2 sm:pt-3 flex justify-between font-medium text-sm sm:text-base">
                    <span className="text-white">Net payout:</span>
                    <span className="text-emerald-400">${selectedPayout.netAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-emerald-900/20 pt-2 sm:pt-3">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">PayPal Email</p>
                    <p className="text-white text-sm sm:text-base break-all">{selectedPayout.paypalEmail}</p>
                  </div>
                </div>
              </div>

              {selectedPayout.doctor.credits < selectedPayout.credits && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    Warning: Doctor currently has only{" "}
                    {selectedPayout.doctor.credits} credits but this payout
                    requires {selectedPayout.credits} credits. The payout cannot
                    be processed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={closeDialogs}
                className="border-emerald-900/30 w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                onClick={() => handleApprovePayout(selectedPayout)}
                disabled={selectedPayout.doctor.credits < selectedPayout.credits}
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve Payout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Confirmation Dialog */}
      {showApproveDialog && selectedPayout && (
        <Dialog
          open={showApproveDialog}
          onOpenChange={() => setShowApproveDialog(false)}
        >
          <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                Confirm Payout Approval
              </DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure you want to approve this payout?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  This action will:
                  <ul className="mt-2 space-y-1 list-disc pl-4">
                    <li>
                      Deduct {selectedPayout.credits} credits from Dr.{" "}
                      {selectedPayout.doctor.name}&apos;s account
                    </li>
                    <li>Mark the payout as PROCESSED</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/20 p-3 sm:p-4 rounded-lg border border-emerald-900/20 space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="text-white">Dr. {selectedPayout.doctor.name}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Amount to pay:</span>
                  <span className="text-emerald-400 font-medium">
                    ${selectedPayout.netAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">PayPal:</span>
                  <span className="text-white text-xs sm:text-sm break-all ml-2 text-right">
                    {selectedPayout.paypalEmail}
                  </span>
                </div>
              </div>
            </div>

            {loading && <BarLoader width={"100%"} color="#36d7b7" />}

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                disabled={loading}
                className="border-emerald-900/30 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApproval}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Approval
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}