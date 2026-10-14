"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { defaultPortfolioData } from "@/lib/default-data";

interface PortfolioContextType {
  portfolio: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  source: string;
  mongoConfigured: boolean;
  updatePortfolio: (newData: PortfolioData) => Promise<boolean>;
  refreshPortfolio: () => Promise<void>;
  resetToDefault: () => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [source, setSource] = useState<string>("default");
  const [mongoConfigured, setMongoConfigured] = useState<boolean>(false);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPortfolio(json.data);
          setSource(json.source || "default");
          setMongoConfigured(Boolean(json.mongoConfigured));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live portfolio data, using default:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const updatePortfolio = async (newData: PortfolioData): Promise<boolean> => {
    setIsSaving(true);
    // Optimistic update
    setPortfolio(newData);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPortfolio(json.data);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update portfolio data:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio/reset", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPortfolio(json.data);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to reset portfolio data:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        isSaving,
        source,
        mongoConfigured,
        updatePortfolio,
        refreshPortfolio: fetchPortfolio,
        resetToDefault,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return ctx;
}
