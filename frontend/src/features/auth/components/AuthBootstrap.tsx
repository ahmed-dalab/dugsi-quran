import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SessionSkeleton } from "@/components/skeletons";
import { clearAuth, setBootstrapping, setCredentials } from "@/features/auth/authSlice";
import { useRefreshMutation } from "@/features/auth/authApi";

type Props = {
  children: React.ReactNode;
};

export default function AuthBootstrap({ children }: Props) {
  const dispatch = useAppDispatch();
  const isBootstrapping = useAppSelector((state) => state.auth.isBootstrapping);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      dispatch(setBootstrapping(true));

      try {
        const result = await refresh().unwrap();
      
        if (!mounted) return;

        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            user: result.user,
          })
        );
      } catch {
        if (!mounted) return;
        dispatch(clearAuth());
      } finally {
        if (!mounted) return;
        dispatch(setBootstrapping(false));
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [dispatch, refresh]);

  if (isBootstrapping) {
    return <SessionSkeleton />;
  }

  return <>{children}</>;
}