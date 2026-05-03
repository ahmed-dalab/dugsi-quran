import type { FeePayment } from "../types/fee.types";
import DeleteFeeDialog from "./DeleteFeeDialog";
import EditFeeDialog from "./EditFeeDialog";

interface FeesTableProps {
  fees: FeePayment[];
}

const statusClassMap: Record<FeePayment["status"], string> = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function FeesTable({ fees }: FeesTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {fees.map((fee) => {
          const studentName = typeof fee.studentId === "string" ? fee.studentId : fee.studentId.fullName;
          const className = typeof fee.classId === "string" ? fee.classId : fee.classId.name;

          return (
            <div key={fee._id} className="rounded-lg border bg-background p-4">
              <div className="space-y-1">
                <p className="font-medium">{studentName}</p>
                <p className="text-sm text-muted-foreground">Class: {className}</p>
                <p className="text-sm text-muted-foreground">Period: {fee.month}/{fee.year}</p>
                <p className="text-sm text-muted-foreground">Due: ${fee.amountDue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Paid: ${fee.amountPaid.toFixed(2)}</p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClassMap[fee.status]}`}>
                  {fee.status}
                </span>
              </div>

              <div className="mt-4 grid gap-2">
                <EditFeeDialog fee={fee} triggerClassName="w-full justify-start" />
                <DeleteFeeDialog fee={fee} triggerClassName="w-full justify-start" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden rounded-lg border bg-white md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Month/Year</th>
              <th className="px-4 py-3 text-left">Amount Due</th>
              <th className="px-4 py-3 text-left">Amount Paid</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => {
              const studentName = typeof fee.studentId === "string" ? fee.studentId : fee.studentId.fullName;
              const className = typeof fee.classId === "string" ? fee.classId : fee.classId.name;

              return (
                <tr key={fee._id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{studentName}</td>
                  <td className="px-4 py-3">{className}</td>
                  <td className="px-4 py-3">{fee.month}/{fee.year}</td>
                  <td className="px-4 py-3">${fee.amountDue.toFixed(2)}</td>
                  <td className="px-4 py-3">${fee.amountPaid.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClassMap[fee.status]}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <EditFeeDialog fee={fee} />
                      <DeleteFeeDialog fee={fee} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
