import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";

import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import  { loginSchema } from "../schemas/loginSchema";
import { useLoginMutation } from "../authApi";
import loginImage from "@/assets/login.png";



type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   async function onSubmit(values: LoginFormValues) {
    try {
      const response = await login(values).unwrap();

     dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        })
      );
      if (response.user.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      if (response.user.role === "teacher") {
        navigate("/teacher", { replace: true });
        return;
      }

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

   function getErrorMessage() {
    if (!error) return null;

    if ("data" in error && error.data && typeof error.data === "object") {
      const data = error.data as { message?: string };
      return data.message ?? "Login failed";
    }

    return "Login failed";
  }

  const apiErrorMessage = getErrorMessage();

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <Card className="relative z-10 w-full max-w-md border-white/30 bg-background/90 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-4 items-center text-center">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      placeholder="name@gmail.com"
                      autoComplete="gmail"
                      aria-invalid={fieldState.invalid}
                      className="h-11 rounded-xl border-white/40 bg-white/90 shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary/70"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        className="h-11 rounded-xl border-white/40 bg-white/90 pr-11 shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary/70"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {apiErrorMessage && (
                <p className="text-sm text-destructive">{apiErrorMessage}</p>
              )}
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="h-11 w-full rounded-xl bg-primary font-semibold shadow-lg transition hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
