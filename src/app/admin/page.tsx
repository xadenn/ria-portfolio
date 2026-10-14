"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  Project,
  ToolItem,
  DesignItem,
  Achievement,
  ServiceItem,
  JourneyMilestone,
} from "@/types/portfolio";
import {
  ArrowUpRight,
  X,
  Check,
  DownloadSimple,
  Trash,
  PencilSimple,
  Plus,
  ArrowLeft,
  CheckCircle,
  MagnifyingGlass,
  Sparkle,
  Database,
  UploadSimple,
  ArrowCounterClockwise,
  LockKey,
  Eye,
  EyeSlash,
  SignOut,
  ShieldCheck,
  Key,
} from "@phosphor-icons/react";
import ImagePickerField from "./components/ImagePickerField";

export default function AdminPage() {
  const {
    portfolio,
    isSaving,
    mongoConfigured,
    updatePortfolio,
    resetToDefault,
  } = usePortfolio();

  // Active Chapter Navigation
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "projects"
    | "designs"
    | "tools"
    | "achievements"
    | "services"
    | "journey"
    | "database"
  >("profile");

  // Local editable draft state
  const [draft, setDraft] = useState(portfolio);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "info" | "error">("info");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Authentication Gate State ─────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check administrative session on mount
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setIsAuthenticated(Boolean(data.authenticated));
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError("Please enter your administrative access key");
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
        setLoginError(null);
      } else {
        setLoginError(data.error || "Incorrect administrative access key");
      }
    } catch {
      setLoginError("Connection failed. Please check network.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Sign out of Ria Verma Atelier Archive?")) {
      try {
        await fetch("/api/admin/logout", { method: "POST" });
      } finally {
        setIsAuthenticated(false);
      }
    }
  };

  // Sync draft when portfolio loads initial data
  useEffect(() => {
    setDraft(portfolio);
    setHasUnsavedChanges(false);
  }, [portfolio]);

  // Mark draft as dirty on modification
  const markDirty = () => setHasUnsavedChanges(true);

  // Handle saving the full draft
  const handleSaveAll = async () => {
    setSaveStatus("Saving changes...");
    setStatusType("info");
    const success = await updatePortfolio(draft);
    if (success) {
      setSaveStatus("Archive updated successfully.");
      setStatusType("success");
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus(null), 3500);
    } else {
      setSaveStatus("Failed to update archive. Please check connection.");
      setStatusType("error");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  // Discard local changes back to portfolio
  const handleDiscardChanges = () => {
    if (confirm("Discard all unsaved changes and reload live portfolio state?")) {
      setDraft(portfolio);
      setHasUnsavedChanges(false);
      setSaveStatus("Draft reverted.");
      setStatusType("info");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // ── Modals State ──────────────────────────────────────────────────────────
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);

  const [designModalOpen, setDesignModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<DesignItem | null>(null);

  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<JourneyMilestone | null>(null);

  // ── Profile Update Helpers ────────────────────────────────────────────────
  const handleProfileChange = (key: string, value: unknown) => {
    markDirty();
    setDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  };

  const handleSocialChange = (key: string, value: string) => {
    markDirty();
    setDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        socials: {
          ...prev.profile.socials,
          [key]: value,
        },
      },
    }));
  };

  // ── Project Actions ────────────────────────────────────────────────────────
  const handleSaveProject = (project: Project) => {
    markDirty();
    setDraft((prev) => {
      const existing = prev.projects.find((p) => p.id === project.id);
      let updatedProjects: Project[];
      if (existing) {
        updatedProjects = prev.projects.map((p) => (p.id === project.id ? project : p));
      } else {
        updatedProjects = [project, ...prev.projects];
      }
      return { ...prev, projects: updatedProjects };
    });
    setProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Permanently delete this work from archive?")) {
      markDirty();
      setDraft((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
    }
  };

  // ── Tool Actions ───────────────────────────────────────────────────────────
  const handleSaveTool = (tool: ToolItem) => {
    markDirty();
    setDraft((prev) => {
      const existing = prev.tools.find((t) => t.id === tool.id);
      let updatedTools: ToolItem[];
      if (existing) {
        updatedTools = prev.tools.map((t) => (t.id === tool.id ? tool : t));
      } else {
        updatedTools = [...prev.tools, tool];
      }
      return { ...prev, tools: updatedTools };
    });
    setToolModalOpen(false);
    setEditingTool(null);
  };

  const handleDeleteTool = (id: string) => {
    if (confirm("Delete this arsenal tool entry?")) {
      markDirty();
      setDraft((prev) => ({
        ...prev,
        tools: prev.tools.filter((t) => t.id !== id),
      }));
    }
  };

  // ── Design Reel Actions ───────────────────────────────────────────────────
  const handleSaveDesign = (design: DesignItem) => {
    markDirty();
    setDraft((prev) => {
      const existing = prev.designs.find((d) => d.id === design.id);
      let updatedDesigns: DesignItem[];
      if (existing) {
        updatedDesigns = prev.designs.map((d) => (d.id === design.id ? design : d));
      } else {
        updatedDesigns = [...prev.designs, design];
      }
      return { ...prev, designs: updatedDesigns };
    });
    setDesignModalOpen(false);
    setEditingDesign(null);
  };

  const handleDeleteDesign = (id: string) => {
    if (confirm("Delete this artwork entry?")) {
      markDirty();
      setDraft((prev) => ({
        ...prev,
        designs: prev.designs.filter((d) => d.id !== id),
      }));
    }
  };

  // ── Achievement Actions ───────────────────────────────────────────────────
  const handleSaveAchievement = (achievement: Achievement) => {
    markDirty();
    setDraft((prev) => {
      const existing = prev.achievements.find((a) => a.id === achievement.id);
      let updated: Achievement[];
      if (existing) {
        updated = prev.achievements.map((a) => (a.id === achievement.id ? achievement : a));
      } else {
        updated = [...prev.achievements, achievement];
      }
      return { ...prev, achievements: updated };
    });
    setAchievementModalOpen(false);
    setEditingAchievement(null);
  };

  const handleDeleteAchievement = (id: string) => {
    if (confirm("Delete this honor record?")) {
      markDirty();
      setDraft((prev) => ({
        ...prev,
        achievements: prev.achievements.filter((a) => a.id !== id),
      }));
    }
  };

  // ── Service Actions ───────────────────────────────────────────────────────
  const handleSaveService = (item: ServiceItem) => {
    markDirty();
    setDraft((prev) => {
      const existing = prev.services.find((s) => s.id === item.id);
      let updated: ServiceItem[];
      if (existing) {
        updated = prev.services.map((s) => (s.id === item.id ? item : s));
      } else {
        updated = [...prev.services, item];
      }
      return { ...prev, services: updated };
    });
    setServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Delete this discipline offering?")) {
      markDirty();
      setDraft((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.id !== id),
      }));
    }
  };

  // ── Journey Actions ───────────────────────────────────────────────────────
  const handleSaveJourney = (item: JourneyMilestone) => {
    markDirty();
    setDraft((prev) => {
      const existing = prev.journey.find((j) => j.id === item.id);
      let updated: JourneyMilestone[];
      if (existing) {
        updated = prev.journey.map((j) => (j.id === item.id ? item : j));
      } else {
        updated = [item, ...prev.journey];
      }
      return { ...prev, journey: updated };
    });
    setJourneyModalOpen(false);
    setEditingJourney(null);
  };

  const handleDeleteJourney = (id: string) => {
    if (confirm("Delete this journey milestone?")) {
      markDirty();
      setDraft((prev) => ({
        ...prev,
        journey: prev.journey.filter((j) => j.id !== id),
      }));
    }
  };

  // ── JSON Import / Restore ────────────────────────────────────────────────
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.projects) {
          setDraft(parsed);
          markDirty();
          setSaveStatus("JSON archive loaded into draft.");
          setStatusType("success");
          setTimeout(() => setSaveStatus(null), 4000);
        } else {
          alert("Invalid portfolio backup file format.");
        }
      } catch {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Chapter Navigation Definitions
  const chapters = [
    { id: "profile", index: "01", label: "IDENTITY", count: null },
    { id: "projects", index: "02", label: "WORKS", count: draft.projects.length },
    { id: "designs", index: "03", label: "REEL", count: draft.designs.length },
    { id: "tools", index: "04", label: "STACK", count: draft.tools.length },
    { id: "achievements", index: "05", label: "HONORS", count: draft.achievements.length },
    { id: "services", index: "06", label: "DISCIPLINES", count: draft.services.length },
    { id: "journey", index: "07", label: "CHRONO", count: draft.journey.length },
    { id: "database", index: "08", label: "SYSTEM", count: null },
  ];

  // Helper filter for lists
  const query = searchQuery.toLowerCase().trim();

  const filteredProjects = draft.projects.filter(
    (p) =>
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.client.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );

  const filteredDesigns = draft.designs.filter(
    (d) =>
      !query ||
      (d.title && d.title.toLowerCase().includes(query)) ||
      d.alt.toLowerCase().includes(query)
  );

  const filteredTools = draft.tools.filter(
    (t) =>
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.proficiency.toLowerCase().includes(query)
  );

  const filteredAchievements = draft.achievements.filter(
    (a) =>
      !query ||
      a.title.toLowerCase().includes(query) ||
      a.organization.toLowerCase().includes(query) ||
      a.metric.toLowerCase().includes(query)
  );

  const filteredJourney = draft.journey.filter(
    (j) =>
      !query ||
      j.company.toLowerCase().includes(query) ||
      j.role.toLowerCase().includes(query) ||
      j.period.toLowerCase().includes(query)
  );

  // ── Authentication Barrier Rendering ─────────────────────────────────────
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center p-6 text-white font-mono text-xs">
        <div className="flex flex-col items-center gap-4 anim-fade-in">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#A5B4FC] animate-spin" />
          <span className="text-white/40 uppercase tracking-widest text-[11px]">
            Verifying Atelier Security Clearance...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col items-center justify-center p-6 relative selection:bg-[#A5B4FC]/25 selection:text-white">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.03)_0%,transparent_65%)] pointer-events-none" />

        {/* Minimal Return Link */}
        <Link
          href="/"
          className="absolute top-6 left-6 sm:top-8 sm:left-10 text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors uppercase inline-flex items-center gap-1.5 min-h-[44px]"
        >
          <ArrowLeft size={12} />
          <span>PORTFOLIO</span>
        </Link>

        {/* Minimal Center Login */}
        <div className="relative z-10 w-full max-w-xs space-y-6 text-center">
          <div className="space-y-1">
            <h1 className="font-kanit font-extrabold text-2xl tracking-wider text-white">
              RIA VERMA
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#A5B4FC]/80">
              Admin Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 text-left">
            <div className="relative">
              <input
                id="admin-pass"
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                placeholder="Password"
                autoFocus
                autoComplete="current-password"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A5B4FC] rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {loginError && (
              <p className="text-red-400 font-mono text-[11px] text-center anim-fade-in">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full min-h-[44px] py-3 px-5 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(255,255,255,0.1)]"
            >
              {isLoggingIn ? (
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#E0E7FF] font-sans antialiased selection:bg-[#A5B4FC]/25 selection:text-white pb-32">
      {/* ─────────────────────────────────────────────────────────────
          LIQUID GLASS FUNCTIONAL HEADER (Apple HIG Layer 2)
          Backdrop-blur, hairline border, floating controls
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0C0C0C]/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Monograph Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 min-h-[44px] px-2 text-xs font-mono tracking-widest text-white/50 hover:text-white transition-colors"
              aria-label="Back to Portfolio"
            >
              <ArrowLeft
                size={13}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="uppercase text-[11px] hidden sm:inline">PORTFOLIO</span>
            </Link>

            <span className="text-white/15 hidden sm:inline">/</span>

            <div className="flex items-baseline gap-2 truncate">
              <span className="font-kanit font-extrabold text-sm sm:text-base tracking-wider text-white">
                RIA VERMA
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#A5B4FC]/80 hidden md:inline">
                ATELIER ARCHIVE
              </span>
            </div>

            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-[#A5B4FC] bg-[#A5B4FC]/10 border border-[#A5B4FC]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A5B4FC] animate-pulse" />
                <span>UNSAVED</span>
              </span>
            )}
          </div>

          {/* Top Actions: Telemetry + Save (Desktop & Tablet) */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
            {/* Storage Beacon */}
            <div className="hidden lg:inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/60 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  mongoConfigured ? "bg-[#A5B4FC] shadow-[0_0_8px_#A5B4FC]" : "bg-white/40"
                }`}
              />
              <span>{mongoConfigured ? "ATLAS CLUSTER" : "LOCAL CACHE"}</span>
            </div>

            {/* View Live */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 min-h-[44px] px-3 text-white/70 hover:text-white transition-colors uppercase tracking-wider text-[11px]"
            >
              <span>PREVIEW</span>
              <ArrowUpRight
                size={12}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#A5B4FC]"
              />
            </a>

            {/* Discard */}
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="hidden sm:inline-flex items-center min-h-[44px] px-3 text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
              >
                DISCARD
              </button>
            )}

            {/* Save Button (Header) */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-6 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-[#EFEEE9] active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.12)]"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">SAVING...</span>
                </>
              ) : (
                <>
                  <span>SAVE</span>
                  <Check size={12} weight="bold" />
                </>
              )}
            </button>

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="group inline-flex items-center gap-1.5 min-h-[44px] px-2.5 sm:px-3 text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider text-[11px] cursor-pointer rounded-lg hover:bg-white/[0.04]"
              title="Sign Out of Atelier"
              aria-label="Sign out of Admin Studio"
            >
              <SignOut size={13} className="group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden lg:inline">LOCK</span>
            </button>
          </div>
        </div>

        {/* Global Save Feedback Banner */}
        {saveStatus && (
          <div className="max-w-7xl mx-auto mt-2 text-center anim-fade-in">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-wider ${
                statusType === "success"
                  ? "bg-white/10 text-white border border-white/20"
                  : statusType === "error"
                  ? "bg-red-500/10 text-red-300 border border-red-500/20"
                  : "bg-white/[0.05] text-white/70 border border-white/10"
              }`}
            >
              {saveStatus}
            </span>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          CHAPTER SEGMENTED NAVIGATOR (Apple HIG Capsule Tabs)
          Smooth horizontal glide with touch-friendly targets
          ───────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Editorial Chapters"
        className="sticky top-[61px] z-30 bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 lg:px-12 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
          {chapters.map((ch) => {
            const isActive = activeTab === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setActiveTab(ch.id as typeof activeTab);
                  setSearchQuery("");
                }}
                className={`min-h-[44px] px-3.5 sm:px-4 rounded-xl font-mono text-[11px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap select-none ${
                  isActive
                    ? "bg-white text-black font-bold shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className={isActive ? "text-black/60" : "text-[#A5B4FC]/80"}>
                  {ch.index}
                </span>
                <span>{ch.label}</span>
                {ch.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive ? "bg-black/10 text-black" : "bg-white/[0.06] text-white/60"
                    }`}
                  >
                    {ch.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL WORKSPACE (Negative Space & Typography)
          Massive vertical rhythm, generous macro-whitespace
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-20">
        {/* ───────────────────────────────────────────────────────────
            CHAPTER 01: IDENTITY
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="space-y-16 lg:space-y-24 max-w-5xl mx-auto">
            {/* Chapter Hero Telemetry */}
            <div className="border-b border-white/[0.08] pb-10 space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                <span>CHAPTER 01</span>
                <span>·</span>
                <span>BIOGRAPHY &amp; TELEMETRY</span>
              </div>
              <h1 className="font-kanit text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                {draft.profile.name || "Ria Verma"}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-white/60 uppercase tracking-wider max-w-2xl leading-relaxed">
                {draft.profile.role} · {draft.profile.location} · {draft.profile.university}
              </p>
            </div>

            {/* Visual Assets Preview & Config */}
            <section className="space-y-8">
              <div className="space-y-1 border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  VISUAL PERSONA ASSETS
                </span>
                <p className="text-xs text-white/50">
                  Full-bleed studio hero and layered foreground cutout portrait
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hero Background Image */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <ImagePickerField
                    label="Studio Background Texture"
                    badge="Full Bleed"
                    value={draft.profile.heroImage}
                    onChange={(val) => handleProfileChange("heroImage", val)}
                    aspectRatio="16/9"
                    placeholder="https://... or /images/..."
                  />
                </div>

                {/* Portrait Cutout Overlay */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <ImagePickerField
                    label="Front Cutout Portrait"
                    badge="Transparent PNG"
                    value={draft.profile.portraitImage}
                    onChange={(val) => handleProfileChange("portraitImage", val)}
                    aspectRatio="16/9"
                    previewContain={true}
                    placeholder="https://... or /images/..."
                  />
                </div>
              </div>
            </section>

            {/* Core Identity Form Fields */}
            <section className="space-y-8">
              <div className="space-y-1 border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  IDENTITY &amp; CREDENTIALS
                </span>
                <p className="text-xs text-white/50">
                  Primary name, headline role, contact dispatches, and base location
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={draft.profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Primary Role Title
                  </label>
                  <input
                    type="text"
                    value={draft.profile.role}
                    onChange={(e) => handleProfileChange("role", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={draft.profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={draft.profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Atelier Base / City
                  </label>
                  <input
                    type="text"
                    value={draft.profile.location}
                    onChange={(e) => handleProfileChange("location", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    University / Alma Mater
                  </label>
                  <input
                    type="text"
                    value={draft.profile.university}
                    onChange={(e) => handleProfileChange("university", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Resume Document Link (PDF URI)
                  </label>
                  <input
                    type="text"
                    value={draft.profile.resumeUrl}
                    onChange={(e) => handleProfileChange("resumeUrl", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Manifesto Statement & Kinetic Bio */}
            <section className="space-y-8">
              <div className="space-y-1 border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  EDITORIAL NARRATIVE &amp; STATEMENT
                </span>
                <p className="text-xs text-white/50">
                  Large typography manifesto and scroll-triggered biography
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Big Headline / Manifesto Statement
                  </label>
                  <textarea
                    rows={2}
                    value={draft.profile.headline}
                    onChange={(e) => handleProfileChange("headline", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl p-4 font-kanit text-xl sm:text-2xl text-cream focus:outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                      Kinetic Biography Paragraph
                    </label>
                    <span className="font-mono text-[10px] text-white/40">
                      {draft.profile.aboutText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={draft.profile.aboutText}
                    onChange={(e) => handleProfileChange("aboutText", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl p-4 text-sm text-white/90 focus:outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* Social Dispatches */}
            <section className="space-y-8">
              <div className="space-y-1 border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  DIGITAL DISPATCHES
                </span>
                <p className="text-xs text-white/50">Public channel profiles</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={draft.profile.socials.linkedin}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-xs font-mono text-white/80 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">
                    GitHub
                  </label>
                  <input
                    type="text"
                    value={draft.profile.socials.github}
                    onChange={(e) => handleSocialChange("github", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-xs font-mono text-white/80 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">
                    Behance
                  </label>
                  <input
                    type="text"
                    value={draft.profile.socials.behance}
                    onChange={(e) => handleSocialChange("behance", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-xs font-mono text-white/80 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Collaborations & Subtitle Tags */}
            <section className="space-y-8">
              <div className="space-y-1 border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  COLLABORATIONS &amp; TICKER TAGS
                </span>
                <p className="text-xs text-white/50">Comma-separated company names and hero badges</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Collaborators &amp; Clients
                  </label>
                  <input
                    type="text"
                    value={draft.profile.collaborations.join(", ")}
                    onChange={(e) =>
                      handleProfileChange(
                        "collaborations",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-white/50">
                    Hero Subtitle Tags
                  </label>
                  <input
                    type="text"
                    value={draft.profile.subtitles.join(", ")}
                    onChange={(e) =>
                      handleProfileChange(
                        "subtitles",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 02: WORKS
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "projects" && (
          <div className="space-y-12">
            {/* Header + Search + Add Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  <span>CHAPTER 02</span>
                  <span>·</span>
                  <span>CURATED WORKS</span>
                </div>
                <h1 className="font-kanit text-3xl sm:text-5xl font-extrabold text-white">
                  Selected Systems ({draft.projects.length})
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Filter */}
                <div className="relative flex-1 sm:w-64">
                  <MagnifyingGlass
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter works..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-full pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Add Work CTA */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject({
                      id: String(Date.now()),
                      title: "",
                      client: "",
                      category: "UI/UX & Platform Design",
                      year: new Date().getFullYear().toString(),
                      image: "/projects/neon-place/img-14.png",
                      description: "",
                      metrics: "",
                      deliverables: ["Product UI/UX", "Design System"],
                      url: "https://",
                    });
                    setProjectModalOpen(true);
                  }}
                  className="min-h-[44px] px-5 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus size={13} weight="bold" />
                  <span>ADD WORK</span>
                </button>
              </div>
            </div>

            {/* Works List - Editorial Bento Cards */}
            <div className="space-y-8 sm:space-y-12">
              {filteredProjects.map((project, idx) => (
                <article
                  key={project.id}
                  className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group"
                >
                  {/* Left: 16:9 Aspect Cover Image */}
                  <div className="lg:col-span-5 aspect-[16/10] bg-black/60 rounded-xl border border-white/10 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded bg-black/80 text-white border border-white/10 uppercase">
                      {project.year}
                    </span>
                  </div>

                  {/* Right: Meta & Descriptions */}
                  <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-white/50 uppercase tracking-widest mb-1.5">
                        <span>[ 0{idx + 1} ]</span>
                        <span>·</span>
                        <span className="text-[#A5B4FC]">{project.category}</span>
                      </div>

                      <h2 className="font-kanit text-2xl sm:text-3xl font-extrabold text-white">
                        {project.title}
                      </h2>
                      <p className="font-mono text-xs text-white/60 uppercase tracking-wider mt-1">
                        Client: {project.client}
                      </p>

                      <p className="text-sm text-white/70 leading-relaxed mt-4 font-light max-w-2xl">
                        {project.description}
                      </p>

                      {project.metrics && (
                        <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-[#A5B4FC]/90">
                          {project.metrics}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.deliverables.map((tag, i) => (
                          <span
                            key={i}
                            className="font-mono text-[10px] uppercase tracking-wider text-white/60 border border-white/10 rounded-md px-2.5 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.06] font-mono text-xs">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                          <span>VISIT SITE</span>
                          <ArrowUpRight size={11} />
                        </a>
                      )}

                      <div className="flex items-center gap-4 ml-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(project);
                            setProjectModalOpen(true);
                          }}
                          className="min-h-[44px] px-3 text-white hover:text-[#A5B4FC] transition-colors uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <PencilSimple size={14} />
                          <span>EDIT</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="min-h-[44px] px-3 text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Trash size={14} />
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filteredProjects.length === 0 && (
                <div className="p-12 text-center rounded-2xl border border-white/[0.08] text-white/40 font-mono text-xs">
                  No projects match your filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 03: VISUAL REEL
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "designs" && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  <span>CHAPTER 03</span>
                  <span>·</span>
                  <span>CINEMATIC REEL</span>
                </div>
                <h1 className="font-kanit text-3xl sm:text-5xl font-extrabold text-white">
                  Visual Artworks ({draft.designs.length})
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <MagnifyingGlass
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter reel..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-full pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingDesign({
                      id: String(Date.now()),
                      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg",
                      alt: "New visual art design",
                      title: "New Visual Artwork",
                    });
                    setDesignModalOpen(true);
                  }}
                  className="min-h-[44px] px-5 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus size={13} weight="bold" />
                  <span>ADD ARTWORK</span>
                </button>
              </div>
            </div>

            {/* Reel Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredDesigns.map((design, i) => (
                <div
                  key={design.id}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 space-y-3 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] bg-black/60 rounded-xl overflow-hidden relative">
                    <img
                      src={design.src}
                      alt={design.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-2 left-2 font-mono text-[9px] bg-black/80 px-2 py-0.5 rounded text-white/70">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="font-kanit text-sm font-semibold text-white truncate">
                      {design.title || design.alt}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] font-mono text-[10px] uppercase">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDesign(design);
                          setDesignModalOpen(true);
                        }}
                        className="text-white/60 hover:text-white cursor-pointer py-1"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDesign(design.id)}
                        className="text-white/30 hover:text-red-400 cursor-pointer py-1"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 04: TECH STACK
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "tools" && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  <span>CHAPTER 04</span>
                  <span>·</span>
                  <span>TOOLING &amp; RUNTIME</span>
                </div>
                <h1 className="font-kanit text-3xl sm:text-5xl font-extrabold text-white">
                  Technical Arsenal ({draft.tools.length})
                </h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingTool({
                    id: String(Date.now()),
                    name: "",
                    category: "Design & Prototyping",
                    proficiency: "Expert",
                    desc: "Design Systems, Auto-layout, Interactive Prototypes",
                  });
                  setToolModalOpen(true);
                }}
                className="min-h-[44px] px-5 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus size={13} weight="bold" />
                <span>ADD TOOL</span>
              </button>
            </div>

            {/* Tools Table / List */}
            <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
              {filteredTools.map((tool, i) => (
                <div
                  key={tool.id}
                  className="py-5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.01]"
                >
                  <div className="flex items-baseline gap-4 sm:gap-8 flex-1">
                    <span className="font-mono text-xs text-white/30 w-8">
                      {i < 9 ? `0${i + 1}` : i + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-kanit text-lg sm:text-xl font-bold text-white">
                          {tool.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#A5B4FC]/80 uppercase">
                          {tool.proficiency}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">{tool.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 font-mono text-xs pl-12 sm:pl-0">
                    <span className="text-[11px] text-white/40 uppercase">
                      {tool.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTool(tool);
                          setToolModalOpen(true);
                        }}
                        className="text-white/60 hover:text-white uppercase cursor-pointer"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-white/30 hover:text-red-400 uppercase cursor-pointer"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 05: HONORS
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "achievements" && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  <span>CHAPTER 05</span>
                  <span>·</span>
                  <span>HONORS &amp; RECOGNITIONS</span>
                </div>
                <h1 className="font-kanit text-3xl sm:text-5xl font-extrabold text-white">
                  Industry Honors ({draft.achievements.length})
                </h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAchievement({
                    id: String(Date.now()),
                    metric: "Top 1%",
                    title: "Design Leadership Award",
                    organization: "Design Excellence Forum",
                    description: "Recognized for high-impact platform architecture.",
                    tag: "Recognition",
                  });
                  setAchievementModalOpen(true);
                }}
                className="min-h-[44px] px-5 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus size={13} weight="bold" />
                <span>ADD HONOR</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAchievements.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-kanit text-2xl font-extrabold text-white">
                        {item.metric}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-white/10 text-[#A5B4FC]">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-kanit text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-white/50 uppercase">
                      {item.organization}
                    </p>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/[0.06] font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAchievement(item);
                        setAchievementModalOpen(true);
                      }}
                      className="text-white/60 hover:text-white uppercase cursor-pointer"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(item.id)}
                      className="text-white/30 hover:text-red-400 uppercase cursor-pointer"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 06: DISCIPLINES
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "services" && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  <span>CHAPTER 06</span>
                  <span>·</span>
                  <span>STUDIO OFFERINGS</span>
                </div>
                <h1 className="font-kanit text-3xl sm:text-5xl font-extrabold text-white">
                  Disciplines ({draft.services.length})
                </h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingService({
                    id: String(Date.now()),
                    number: `0${draft.services.length + 1}`,
                    name: "Design Engineering",
                    description: "End-to-end design systems and frontend implementations.",
                  });
                  setServiceModalOpen(true);
                }}
                className="min-h-[44px] px-5 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus size={13} weight="bold" />
                <span>ADD DISCIPLINE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {draft.services.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-xs text-[#A5B4FC]">
                      {item.number}
                    </span>
                    <h3 className="font-kanit text-xl font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/[0.06] font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(item);
                        setServiceModalOpen(true);
                      }}
                      className="text-white/60 hover:text-white uppercase cursor-pointer"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(item.id)}
                      className="text-white/30 hover:text-red-400 uppercase cursor-pointer"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 07: CHRONO / JOURNEY
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "journey" && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  <span>CHAPTER 07</span>
                  <span>·</span>
                  <span>CAREER CHRONICLE</span>
                </div>
                <h1 className="font-kanit text-3xl sm:text-5xl font-extrabold text-white">
                  Journey Milestones ({draft.journey.length})
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <MagnifyingGlass
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter milestones..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#A5B4FC] rounded-full pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingJourney({
                      id: String(Date.now()),
                      period: "2024 — Present",
                      company: "New Venture",
                      role: "Senior Product Designer",
                      summary: "Leading visual design and architecture.",
                      highlights: [
                        "Designed core platform interfaces",
                        "Led cross-functional design sprints",
                      ],
                    });
                    setJourneyModalOpen(true);
                  }}
                  className="min-h-[44px] px-5 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus size={13} weight="bold" />
                  <span>ADD MILESTONE</span>
                </button>
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-6">
              {filteredJourney.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC]">
                      <span>[ 0{idx + 1} ]</span>
                      <span>{item.period}</span>
                    </div>

                    <div>
                      <h3 className="font-kanit text-2xl font-bold text-white">
                        {item.role}
                      </h3>
                      <p className="font-mono text-xs text-white/60 uppercase tracking-wider mt-0.5">
                        {item.company}
                      </p>
                    </div>

                    <p className="text-sm text-white/70 max-w-2xl font-light">
                      {item.summary}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="space-y-1.5 pt-2">
                        {item.highlights.map((h, i) => (
                          <li
                            key={i}
                            className="text-xs text-white/60 flex items-start gap-2"
                          >
                            <span className="text-[#A5B4FC] mt-0.5">▪</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs md:self-start">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJourney(item);
                        setJourneyModalOpen(true);
                      }}
                      className="min-h-[44px] px-3 text-white/70 hover:text-white uppercase cursor-pointer"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteJourney(item.id)}
                      className="min-h-[44px] px-3 text-white/30 hover:text-red-400 uppercase cursor-pointer"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            CHAPTER 08: SYSTEM & DATABASE
            ─────────────────────────────────────────────────────────── */}
        {activeTab === "database" && (
          <div className="space-y-16 max-w-4xl mx-auto">
            <div className="border-b border-white/[0.08] pb-10 space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                <span>CHAPTER 08</span>
                <span>·</span>
                <span>DATA ENGINE &amp; BACKUPS</span>
              </div>
              <h1 className="font-kanit text-4xl sm:text-6xl font-extrabold text-white">
                Persistence Architecture
              </h1>
              <p className="font-mono text-xs sm:text-sm text-white/60 uppercase tracking-wider">
                MongoDB Atlas Cloud Cluster · Local Storage Fallback · JSON Snapshots
              </p>
            </div>

            {/* Storage Status Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#A5B4FC] uppercase">
                    CURRENT STORAGE ENGINE
                  </span>
                  <Database size={18} className="text-[#A5B4FC]" />
                </div>
                <div className="font-kanit text-2xl font-bold text-white">
                  {mongoConfigured ? "MongoDB Atlas Cloud" : "Local In-Memory / Browser Cache"}
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  {mongoConfigured
                    ? "Production MongoDB Atlas URI is active. Edits sync to cloud across all devices."
                    : "Running on local browser cache. Changes persist in this browser. To persist globally, connect MongoDB Atlas."}
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#A5B4FC] uppercase">
                    DATABASE CONNECTION GUIDE
                  </span>
                  <Sparkle size={18} className="text-[#A5B4FC]" />
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Add your cluster connection string to <code className="text-white bg-white/10 px-1 py-0.5 rounded">.env.local</code>:
                </p>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-white/80 overflow-x-auto">
                  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ria
                </pre>
              </div>
            </div>

            {/* Backup & Restore Tools */}
            <div className="space-y-6">
              <div className="space-y-1 border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs text-[#A5B4FC] uppercase tracking-widest">
                  ARCHIVE SNAPSHOTS
                </span>
                <p className="text-xs text-white/50">Export or restore full portfolio content</p>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Download Backup */}
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(draft, null, 2)
                  )}`}
                  download={`ria_portfolio_backup_${new Date().toISOString().split("T")[0]}.json`}
                  className="min-h-[44px] px-6 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <DownloadSimple size={14} />
                  <span>EXPORT JSON BACKUP</span>
                </a>

                {/* Import File */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-6 rounded-full text-xs font-mono uppercase tracking-wider text-white border border-white/20 hover:border-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <UploadSimple size={14} />
                  <span>RESTORE FROM JSON</span>
                </button>

                {/* Reset to Factory Defaults */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset entire portfolio archive to original studio defaults?")) {
                      resetToDefault();
                      setSaveStatus("Reset to default archive.");
                      setStatusType("info");
                      setTimeout(() => setSaveStatus(null), 3500);
                    }
                  }}
                  className="min-h-[44px] px-6 rounded-full text-xs font-mono uppercase tracking-wider text-white/40 hover:text-red-400 border border-white/10 hover:border-red-400/40 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <ArrowCounterClockwise size={14} />
                  <span>RESET TO DEFAULTS</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE FLOATING ACTION CAPSULE (Thumb Zone - Apple HIG)
          Visible only on mobile devices for easy one-handed actions
          ───────────────────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-4 inset-x-4 z-40 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 pl-2 truncate">
          <span
            className={`w-2 h-2 rounded-full ${
              hasUnsavedChanges ? "bg-[#A5B4FC] animate-pulse" : "bg-white/30"
            }`}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 truncate">
            {hasUnsavedChanges ? "MODIFIED" : "SAVED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="min-h-[44px] px-3 text-white/40 hover:text-white uppercase font-mono text-[10px]"
            >
              DISCARD
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="min-h-[44px] px-5 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            {isSaving ? (
              <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>SAVE</span>
                <Check size={12} weight="bold" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL BOTTOM SHEETS (Responsive: Sheet on Mobile, Centered on Desktop)
          ───────────────────────────────────────────────────────────── */}

      {/* 1. Project Modal */}
      {projectModalOpen && editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
        >
          <div className="bg-[#121212] border border-white/15 w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl">
            {/* Grabber Bar for mobile */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="font-kanit text-xl font-bold text-white">
                  {editingProject.title ? "EDIT WORK" : "ADD WORK"}
                </h2>
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/40 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/50 uppercase">Client</label>
                    <input
                      type="text"
                      value={editingProject.client}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, client: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/50 uppercase">Year</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, year: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Category</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <ImagePickerField
                    label="Cover Image"
                    value={editingProject.image}
                    onChange={(val) =>
                      setEditingProject({ ...editingProject, image: val })
                    }
                    aspectRatio="16/9"
                    placeholder="https://... or /projects/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Key Metrics / Impact</label>
                  <input
                    type="text"
                    value={editingProject.metrics}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, metrics: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Live URL</label>
                  <input
                    type="text"
                    value={editingProject.url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, url: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Deliverables (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingProject.deliverables.join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        deliverables: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setProjectModalOpen(false)}
                className="min-h-[44px] px-5 rounded-xl text-white/50 hover:text-white uppercase font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleSaveProject(editingProject)}
                className="min-h-[44px] px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-95 transition-all"
              >
                SAVE WORK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Artwork Modal */}
      {designModalOpen && editingDesign && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
        >
          <div className="bg-[#121212] border border-white/15 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="font-kanit text-xl font-bold text-white">
                  {editingDesign.title ? "EDIT ARTWORK" : "ADD ARTWORK"}
                </h2>
                <button
                  type="button"
                  onClick={() => setDesignModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/40 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Artwork Title</label>
                  <input
                    type="text"
                    value={editingDesign.title || ""}
                    onChange={(e) =>
                      setEditingDesign({ ...editingDesign, title: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <ImagePickerField
                    label="Artwork Image"
                    value={editingDesign.src}
                    onChange={(val) =>
                      setEditingDesign({ ...editingDesign, src: val })
                    }
                    aspectRatio="4/5"
                    placeholder="https://... or /cases/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Alt Text</label>
                  <input
                    type="text"
                    value={editingDesign.alt}
                    onChange={(e) =>
                      setEditingDesign({ ...editingDesign, alt: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setDesignModalOpen(false)}
                className="min-h-[44px] px-5 rounded-xl text-white/50 hover:text-white uppercase font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleSaveDesign(editingDesign)}
                className="min-h-[44px] px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tool Modal */}
      {toolModalOpen && editingTool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
        >
          <div className="bg-[#121212] border border-white/15 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="font-kanit text-xl font-bold text-white">
                  {editingTool.name ? "EDIT TOOL" : "ADD TOOL"}
                </h2>
                <button
                  type="button"
                  onClick={() => setToolModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/40 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Tool Name</label>
                  <input
                    type="text"
                    value={editingTool.name}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, name: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Category</label>
                  <select
                    value={editingTool.category}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        category: e.target.value as "Design & Prototyping" | "Engineering & Workflow",
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  >
                    <option value="Design & Prototyping">Design &amp; Prototyping</option>
                    <option value="Engineering & Workflow">Engineering &amp; Workflow</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Proficiency Level</label>
                  <input
                    type="text"
                    value={editingTool.proficiency}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, proficiency: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Skills &amp; Specialties</label>
                  <textarea
                    rows={2}
                    value={editingTool.desc}
                    onChange={(e) =>
                      setEditingTool({ ...editingTool, desc: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setToolModalOpen(false)}
                className="min-h-[44px] px-5 rounded-xl text-white/50 hover:text-white uppercase font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleSaveTool(editingTool)}
                className="min-h-[44px] px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Honor Modal */}
      {achievementModalOpen && editingAchievement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
        >
          <div className="bg-[#121212] border border-white/15 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="font-kanit text-xl font-bold text-white">
                  {editingAchievement.title ? "EDIT HONOR" : "ADD HONOR"}
                </h2>
                <button
                  type="button"
                  onClick={() => setAchievementModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/40 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Prominent Metric (e.g. Top 1%)</label>
                  <input
                    type="text"
                    value={editingAchievement.metric}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, metric: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Honor Title</label>
                  <input
                    type="text"
                    value={editingAchievement.title}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, title: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Organization</label>
                  <input
                    type="text"
                    value={editingAchievement.organization}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, organization: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Tag / Category</label>
                  <input
                    type="text"
                    value={editingAchievement.tag}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, tag: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={editingAchievement.description}
                    onChange={(e) =>
                      setEditingAchievement({ ...editingAchievement, description: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setAchievementModalOpen(false)}
                className="min-h-[44px] px-5 rounded-xl text-white/50 hover:text-white uppercase font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleSaveAchievement(editingAchievement)}
                className="min-h-[44px] px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Service Modal */}
      {serviceModalOpen && editingService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
        >
          <div className="bg-[#121212] border border-white/15 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="font-kanit text-xl font-bold text-white">
                  {editingService.name ? "EDIT DISCIPLINE" : "ADD DISCIPLINE"}
                </h2>
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/40 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Index (e.g. 01)</label>
                  <input
                    type="text"
                    value={editingService.number}
                    onChange={(e) =>
                      setEditingService({ ...editingService, number: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Discipline Name</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({ ...editingService, name: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Description</label>
                  <textarea
                    rows={3}
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                className="min-h-[44px] px-5 rounded-xl text-white/50 hover:text-white uppercase font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleSaveService(editingService)}
                className="min-h-[44px] px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Journey Modal */}
      {journeyModalOpen && editingJourney && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
        >
          <div className="bg-[#121212] border border-white/15 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h2 className="font-kanit text-xl font-bold text-white">
                  {editingJourney.company ? "EDIT MILESTONE" : "ADD MILESTONE"}
                </h2>
                <button
                  type="button"
                  onClick={() => setJourneyModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/40 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/50 uppercase">Period</label>
                    <input
                      type="text"
                      value={editingJourney.period}
                      onChange={(e) =>
                        setEditingJourney({ ...editingJourney, period: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/50 uppercase">Company / Venture</label>
                    <input
                      type="text"
                      value={editingJourney.company}
                      onChange={(e) =>
                        setEditingJourney({ ...editingJourney, company: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Role</label>
                  <input
                    type="text"
                    value={editingJourney.role}
                    onChange={(e) =>
                      setEditingJourney({ ...editingJourney, role: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Summary Statement</label>
                  <textarea
                    rows={2}
                    value={editingJourney.summary}
                    onChange={(e) =>
                      setEditingJourney({ ...editingJourney, summary: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/50 uppercase">Highlights (One per line)</label>
                  <textarea
                    rows={3}
                    value={editingJourney.highlights.join("\n")}
                    onChange={(e) =>
                      setEditingJourney({
                        ...editingJourney,
                        highlights: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A5B4FC] font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setJourneyModalOpen(false)}
                className="min-h-[44px] px-5 rounded-xl text-white/50 hover:text-white uppercase font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleSaveJourney(editingJourney)}
                className="min-h-[44px] px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider font-mono text-xs hover:bg-[#EFEEE9] active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
