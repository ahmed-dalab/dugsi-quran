export type FeePaymentStatus = "paid" | "partial" | "unpaid";

export interface FeeStudent {
  _id: string;
  fullName: string;
}

export interface FeeClass {
  _id: string;
  name: string;
  levelOrder?: number;
}

export interface FeeReceiver {
  _id: string;
  name: string;
}

export interface FeePayment {
  _id: string;
  studentId: string | FeeStudent;
  classId: string | FeeClass;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  status: FeePaymentStatus;
  paymentDate?: string | null;
  receivedBy?: string | FeeReceiver | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
