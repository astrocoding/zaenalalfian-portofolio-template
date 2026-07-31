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

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<SidebarState>("open");

  // Read initial state from localStorage on client mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "open" || saved === "close") {
        setState(saved);
      }
    } catch {
      // Fallback to "open" if localStorage is unavailable
    }
  }, []);

  const setSidebarState = React.useCallback((newState: SidebarState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, newState);
    } catch {
      // Ignore storage write errors
    }
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setState((prev) => {
      const next = prev === "open" ? "close" : "open";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore
      }
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
