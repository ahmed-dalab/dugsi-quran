import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
      <Card className="relative z-10 w-full max-w-md bg-background/95 backdrop-blur-sm">
        <CardHeader className="space-y-4">
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
                      placeholder="name@example.com"
                      autoComplete="gmail"
                      aria-invalid={fieldState.invalid}
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
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />
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
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
