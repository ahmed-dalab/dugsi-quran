import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "./api/settingsApi";
import { updateSettingsSchema, type UpdateSettingsFormValues } from "./schemas/updateSettingsSchema";

export default function Settings() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError } = useGetSettingsQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const form = useForm<UpdateSettingsFormValues>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      schoolName: "",
      schoolEmail: "",
      schoolPhone: "",
      schoolAddress: "",
      timezone: "Africa/Mogadishu",
      currency: "USD",
      attendanceEditWindowDays: 7,
      activeAcademicYear: "",
    },
  });

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    form.reset({
      schoolName: data.data.schoolName,
      schoolEmail: data.data.schoolEmail ?? "",
      schoolPhone: data.data.schoolPhone ?? "",
      schoolAddress: data.data.schoolAddress ?? "",
      timezone: data.data.timezone,
      currency: data.data.currency,
      attendanceEditWindowDays: data.data.attendanceEditWindowDays,
      activeAcademicYear: data.data.activeAcademicYear,
    });
  }, [data, form]);

  async function onSubmit(values: UpdateSettingsFormValues) {
    try {
      await updateSettings({
        ...values,
        currency: values.currency.toUpperCase(),
        schoolEmail: values.schoolEmail.trim() ? values.schoolEmail.trim() : null,
        schoolPhone: values.schoolPhone.trim() ? values.schoolPhone.trim() : null,
        schoolAddress: values.schoolAddress.trim() ? values.schoolAddress.trim() : null,
      }).unwrap();

      toast.success("Settings updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update settings failed:", error);
      toast.error(error?.data?.message || "Failed to update settings");
    }
  }

  function handleCancelEdit() {
    if (data?.data) {
      form.reset({
        schoolName: data.data.schoolName,
        schoolEmail: data.data.schoolEmail ?? "",
        schoolPhone: data.data.schoolPhone ?? "",
        schoolAddress: data.data.schoolAddress ?? "",
        timezone: data.data.timezone,
        currency: data.data.currency,
        attendanceEditWindowDays: data.data.attendanceEditWindowDays,
        activeAcademicYear: data.data.activeAcademicYear,
      });
    }
    setIsEditing(false);
  }

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (isError) {
    return <div>Failed to load settings.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your school profile and operational preferences.
        </p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>School Settings</CardTitle>
          <CardDescription>
            These values are shared across the admin system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isEditing ? (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">School Name</p>
                  <p className="font-medium">{data?.data.schoolName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">School Email</p>
                  <p className="font-medium">{data?.data.schoolEmail || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">School Phone</p>
                  <p className="font-medium">{data?.data.schoolPhone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">School Address</p>
                  <p className="font-medium">{data?.data.schoolAddress || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timezone</p>
                  <p className="font-medium">{data?.data.timezone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="font-medium">{data?.data.currency || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Attendance Edit Window</p>
                  <p className="font-medium">
                    {data?.data.attendanceEditWindowDays ?? "-"} days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Academic Year</p>
                  <p className="font-medium">{data?.data.activeAcademicYear || "-"}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="schoolName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="settings-school-name">School Name</FieldLabel>
                      <Input {...field} id="settings-school-name" placeholder="Enter school name" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="schoolEmail"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-school-email">School Email</FieldLabel>
                        <Input {...field} id="settings-school-email" type="email" placeholder="school@example.com" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="schoolPhone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-school-phone">School Phone</FieldLabel>
                        <Input {...field} id="settings-school-phone" placeholder="Enter school phone" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="schoolAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="settings-school-address">School Address</FieldLabel>
                      <Input {...field} id="settings-school-address" placeholder="Enter school address" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="timezone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-timezone">Timezone</FieldLabel>
                        <Input {...field} id="settings-timezone" placeholder="Africa/Mogadishu" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="currency"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-currency">Currency</FieldLabel>
                        <Input
                          {...field}
                          id="settings-currency"
                          placeholder="USD"
                          onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="attendanceEditWindowDays"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-attendance-window">Attendance Edit Window (days)</FieldLabel>
                        <Input
                          {...field}
                          id="settings-attendance-window"
                          type="number"
                          min={0}
                          max={60}
                          onChange={(event) => field.onChange(event.target.valueAsNumber)}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="activeAcademicYear"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-academic-year">Active Academic Year</FieldLabel>
                        <Input {...field} id="settings-academic-year" placeholder="2026" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button type="submit" form="settings-form" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
