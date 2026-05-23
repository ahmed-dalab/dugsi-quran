export interface ISettings {
  schoolName: string;
  schoolEmail?: string | null;
  schoolPhone?: string | null;
  schoolAddress?: string | null;
  timezone: string;
  currency: string;
  attendanceEditWindowDays: number;
  activeAcademicYear: string;
}
