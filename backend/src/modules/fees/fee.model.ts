export type FeePaymentStatus = "paid" | "partial" | "unpaid";

export interface IFeePayment {
  studentId: string;
  classId?: string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid?: number;
  status?: FeePaymentStatus;
  paymentDate?: Date | null;
  receivedBy?: string | null;
  note?: string;
}
