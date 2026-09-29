"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadDashboard,
  addFunds,
  recordInvestment,
  recordPayout,
  setRoleCookie,
} from "@/lib/dashboard/store";
import type {
  DashboardState,
  PaymentMethod,
  UserRole,
} from "@/lib/dashboard/types";

type DashboardContextValue = {
  role: UserRole;
  state: DashboardState;
  setRole: (role: UserRole) => void;
  refresh: () => void;
  invest: (input: {
    projectId: string;
    amountUsd: number;
    shareLabel: string;
    method: PaymentMethod;
  }) => DashboardState;
  topUp: (amountUsd: number, method: PaymentMethod) => DashboardState;
  payout: (amountUsd: number, reference: string) => DashboardState;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  initialRole,
  children,
}: {
  initialRole: UserRole;
  children: ReactNode;
}) {
  const [role, setRoleState] = useState<UserRole>(initialRole);
  const [state, setState] = useState(() => loadDashboard(initialRole));

  useEffect(() => {
    setState(loadDashboard(role));
  }, [role]);

  const setRole = useCallback((next: UserRole) => {
    setRoleCookie(next);
    setRoleState(next);
    setState(loadDashboard(next));
  }, []);

  const refresh = useCallback(() => {
    setState(loadDashboard(role));
  }, [role]);

  const invest = useCallback<DashboardContextValue["invest"]>((input) => {
    const next = recordInvestment(input);
    setState(next);
    return next;
  }, []);

  const topUp = useCallback<DashboardContextValue["topUp"]>((amountUsd, method) => {
    const next = addFunds(amountUsd, method);
    setState(next);
    return next;
  }, []);

  const payout = useCallback<DashboardContextValue["payout"]>(
    (amountUsd, reference) => {
      const next = recordPayout(amountUsd, reference);
      setState(next);
      return next;
    },
    [],
  );

  const value = useMemo(
    () => ({ role, state, setRole, refresh, invest, topUp, payout }),
    [role, state, setRole, refresh, invest, topUp, payout],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return context;
}
