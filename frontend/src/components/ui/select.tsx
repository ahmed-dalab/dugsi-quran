import * as React from "react";
import ReactSelect, {
  type GroupBase,
  type Props as ReactSelectProps,
  type StylesConfig,
} from "react-select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

export type AppSelectProps = {
  options: SelectOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  noOptionsMessage?: string;
};

const getCssVar = (name: string, fallback: string) => {
  if (typeof document === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

const buildStyles = (invalid?: boolean): StylesConfig<SelectOption, false> => ({
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: invalid
      ? getCssVar("--destructive", "#dc2626")
      : state.isFocused
        ? getCssVar("--primary", "#1e3a8a")
        : getCssVar("--border", "#e2e8f0"),
    backgroundColor: getCssVar("--card", "#ffffff"),
    boxShadow: state.isFocused
      ? invalid
        ? "0 0 0 4px color-mix(in oklch, var(--destructive) 15%, transparent)"
        : "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
      : "0 0 0 1px transparent",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      borderColor: invalid
        ? getCssVar("--destructive", "#dc2626")
        : getCssVar("--primary", "#1e3a8a"),
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "2px 12px",
    fontSize: "0.875rem",
  }),
  placeholder: (base) => ({
    ...base,
    color: getCssVar("--muted-foreground", "#64748b"),
    fontSize: "0.875rem",
  }),
  singleValue: (base) => ({
    ...base,
    color: getCssVar("--foreground", "#0f172a"),
    fontSize: "0.875rem",
  }),
  input: (base) => ({
    ...base,
    color: getCssVar("--foreground", "#0f172a"),
    fontSize: "0.875rem",
    margin: 0,
    padding: 0,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    border: `1px solid ${getCssVar("--border", "#e2e8f0")}`,
    backgroundColor: getCssVar("--popover", "#ffffff"),
    boxShadow: "0 10px 30px -12px rgb(15 23 42 / 0.25)",
    overflow: "hidden",
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    padding: 6,
    maxHeight: 240,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 8,
    fontSize: "0.875rem",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    backgroundColor: state.isSelected
      ? getCssVar("--primary", "#1e3a8a")
      : state.isFocused
        ? getCssVar("--accent", "#f1f5f9")
        : "transparent",
    color: state.isSelected
      ? getCssVar("--primary-foreground", "#ffffff")
      : getCssVar("--foreground", "#0f172a"),
    opacity: state.isDisabled ? 0.5 : 1,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? getCssVar("--primary", "#1e3a8a")
      : getCssVar("--muted-foreground", "#64748b"),
    paddingRight: 12,
    "&:hover": {
      color: getCssVar("--primary", "#1e3a8a"),
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: getCssVar("--muted-foreground", "#64748b"),
    paddingRight: 4,
    "&:hover": {
      color: getCssVar("--destructive", "#dc2626"),
    },
  }),
  loadingIndicator: (base) => ({
    ...base,
    color: getCssVar("--primary", "#1e3a8a"),
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: getCssVar("--muted-foreground", "#64748b"),
    fontSize: "0.875rem",
  }),
});

export function toSelectOption(
  value: string | null | undefined,
  options: SelectOption[]
): SelectOption | null {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value) ?? null;
}

function AppSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  isClearable = false,
  isSearchable = true,
  isLoading = false,
  invalid = false,
  id,
  className,
  noOptionsMessage = "No options found",
}: AppSelectProps) {
  const selected = React.useMemo(() => toSelectOption(value, options), [value, options]);

  const selectProps: ReactSelectProps<SelectOption, false, GroupBase<SelectOption>> = {
    inputId: id,
    instanceId: id,
    options,
    value: selected,
    onChange: (option) => onChange(option?.value ?? null),
    placeholder,
    isDisabled,
    isClearable,
    isSearchable,
    isLoading,
    menuPortalTarget: typeof document !== "undefined" ? document.body : null,
    menuPosition: "fixed",
    styles: {
      ...buildStyles(invalid),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    },
    noOptionsMessage: () => noOptionsMessage,
    classNamePrefix: "app-select",
  };

  return (
    <div className={cn("w-full", className)} data-invalid={invalid || undefined}>
      <ReactSelect {...selectProps} />
    </div>
  );
}

export { AppSelect, AppSelect as Select };
