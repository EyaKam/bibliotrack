"use client";

import { Button } from "@/components/ui/button";
import { updateBorrowRecord } from "@/lib/admin/actions/Borrow";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const BorrowTableActions = ({ recordId, status }: { recordId: string, status: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkAsReturned = async () => {
    setLoading(true);
    try {
      const result = await updateBorrowRecord(recordId, {
        status: "RETURNED",
        returnDate: new Date().toISOString(),
      });

      if (result.success) {
        toast.success("Book marked as returned successfully");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "RETURNED") {
    return <span className="text-xs text-slate-400 italic">No actions</span>;
  }

  return (
    <Button
      onClick={handleMarkAsReturned}
      disabled={loading}
      variant="outline"
      size="sm"
      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Returned"}
    </Button>
  );
};