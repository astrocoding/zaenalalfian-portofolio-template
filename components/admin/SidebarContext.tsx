"use client";

import * as React from "react";

type SidebarState = "open" | "close";

interface SidebarContextType {
  state: SidebarState;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = "sidebar";

export interface SidebarProviderProps {
  children: React.ReactNode;
  initialState?: SidebarState;
}

function syncSidebarStateToStorage(newState: SidebarState) {
  try {
    localStorage.setItem(STORAGE_KEY, newState);
    document.cookie = `sidebar=${newState}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore storage write errors
  }
}

function getInitialSidebarState(fallback: SidebarState): SidebarState {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "open" || saved === "close") return saved;
  } catch {
    // Ignore
  }
  return fallback;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  initialState = "open",
}) => {
  const [state, setState] = React.useState<SidebarState>(() =>
    getInitialSidebarState(initialState)
  );

  const setSidebarState = React.useCallback((newState: SidebarState) => {
    setState(newState);
    syncSidebarStateToStorage(newState);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setState((prev) => {
      const next = prev === "open" ? "close" : "open";
      syncSidebarStateToStorage(next);
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      isCollapsed: state === "close",
      toggleSidebar,
      setSidebarState,
    }),
    [state, toggleSidebar, setSidebarState]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarContextType => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    return {
      state: "open",
      isCollapsed: false,
      toggleSidebar: () => {},
      setSidebarState: () => {},
    };
  }
  return context;
};
