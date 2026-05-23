export interface IClass {
  name: string;
  levelOrder: number;
  monthlyFee?: number;
  teacherId?: string | null;
  isActive?: boolean;
}
