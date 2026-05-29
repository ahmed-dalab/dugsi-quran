import { useAppSelector } from "@/app/hooks";

export function useAuthQuerySkip() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  return {
    accessToken,
    isBootstrapping,
    skip: isBootstrapping || !accessToken,
  };
}
