"use client";

import { ClerkProvider, useClerk, useUser } from "@clerk/nextjs";
import { createContext, type ReactNode, useContext, useMemo } from "react";

interface AuthContextValue {
  enabled: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  user: {
    id: string;
    fullName: string | null;
    imageUrl: string;
    primaryEmail: string | null;
  } | null;
  openSignIn: () => void;
  openUserProfile: () => void;
  signOut: () => Promise<void>;
}

const disabledAuth: AuthContextValue = {
  enabled: false,
  isLoaded: true,
  isSignedIn: false,
  user: null,
  openSignIn: () => undefined,
  openUserProfile: () => undefined,
  signOut: async () => undefined,
};

const AuthContext = createContext<AuthContextValue>(disabledAuth);

function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, openUserProfile, signOut } = useClerk();
  const value = useMemo<AuthContextValue>(
    () => ({
      enabled: true,
      isLoaded,
      isSignedIn: Boolean(isSignedIn),
      user: user
        ? {
            id: user.id,
            fullName: user.fullName,
            imageUrl: user.imageUrl,
            primaryEmail: user.primaryEmailAddress?.emailAddress ?? null,
          }
        : null,
      openSignIn: () => openSignIn(),
      openUserProfile: () => openUserProfile(),
      signOut: async () => {
        await signOut();
      },
    }),
    [isLoaded, isSignedIn, openSignIn, openUserProfile, signOut, user],
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
