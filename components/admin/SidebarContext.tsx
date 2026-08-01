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

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  initialState = "open",
}) => {
  const [state, setState] = React.useState<SidebarState>(initialState);

  // Sync client state with localStorage if client has saved state
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if ((saved === "open" || saved === "close") && saved !== state) {
        setState(saved);
        document.cookie = `sidebar=${saved}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // Ignore
    }
  }, []);

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
