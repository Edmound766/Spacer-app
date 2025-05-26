import { useAppDispatch } from "@app/hooks";
import React, { useEffect, useState } from "react";
import { useGetProfileQuery } from "./authApi";
import { clearUser, setUser } from "@features/users/userSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const dispatch = useAppDispatch();
  const {
    data: user = null,
    isLoading,
    isError,
    isSuccess,
  } = useGetProfileQuery();

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    else if (isSuccess && user) {
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }
    setAuthChecked(true);
  }, [user, isLoading, isSuccess, isError, dispatch]);

  if (!authChecked) return <div>Loading</div>;

  return <>{children}</>;
}
