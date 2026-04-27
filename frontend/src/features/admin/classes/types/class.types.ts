export interface ClassItem {
  _id: string;
  name: string;
  levelOrder: number;
  monthlyFee: number;
  teacherId?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
