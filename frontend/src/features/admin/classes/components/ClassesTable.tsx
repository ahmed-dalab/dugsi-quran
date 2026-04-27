import type { ClassItem } from "../types/class.types";
import DeleteClassDialog from "./DeleteClassDialog";
import EditClassDialog from "./EditClassDialog";

interface ClassesTableProps {
  classes: ClassItem[];
}

export default function ClassesTable({ classes }: ClassesTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {classes.map((classItem) => (
          <div key={classItem._id} className="rounded-lg border bg-background p-4">
            <div className="space-y-1">
              <p className="font-medium">{classItem.name}</p>
              <p className="text-sm text-muted-foreground">
                Level: {classItem.levelOrder}
              </p>
              <p className="text-sm text-muted-foreground">
                Monthly Fee: ${classItem.monthlyFee}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  classItem.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {classItem.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              <EditClassDialog
                classItem={classItem}
                triggerClassName="w-full justify-start"
              />
              <DeleteClassDialog
                classItem={classItem}
                triggerClassName="w-full justify-start"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden rounded-lg border bg-white md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Monthly Fee</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem._id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{classItem.name}</td>
                <td className="px-4 py-3">{classItem.levelOrder}</td>
                <td className="px-4 py-3">${classItem.monthlyFee}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      classItem.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {classItem.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <EditClassDialog classItem={classItem} />
                    <DeleteClassDialog classItem={classItem} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
