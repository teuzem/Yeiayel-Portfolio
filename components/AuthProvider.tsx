"use client";

import { ClerkProvider, useClerk, useUser } from "@clerk/nextjs";
import { createContext, type ReactNode, useContext, useMemo } from "react";

interface AuthContextValue {
  enabled: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  openSignIn: () => void;
  signOut: () => Promise<void>;
}

const disabledAuth: AuthContextValue = {
  enabled: false,
  isLoaded: true,
  isSignedIn: false,
  openSignIn: () => undefined,
  signOut: async () => undefined,
};

const AuthContext = createContext<AuthContextValue>(disabledAuth);

function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn, signOut } = useClerk();
  const value = useMemo<AuthContextValue>(
    () => ({
      enabled: true,
      isLoaded,
      isSignedIn: Boolean(isSignedIn),
      openSignIn: () => openSignIn(),
      signOut: async () => {
        await signOut();
      },
    }),
    [isLoaded, isSignedIn, openSignIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({
  children,
  publishableKey,
}: {
  children: ReactNode;
  publishableKey?: string;
}) {
  if (!publishableKey) {
    return (
      <AuthContext.Provider value={disabledAuth}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  );
}

export function useOptionalAuth() {
  return useContext(AuthContext);
}
