"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { signOut, useSession } from "next-auth/react";
import { DiscordUser, ResourceTree } from "../typings";

type AppData = {
  user: DiscordUser | null;
  folderPath: string | null;
  resources: ResourceTree;
  isScanningResources: boolean;

  isAuthenticated: boolean;
  isLoading: boolean;

  setFolderPath: (path: string | null) => void;
  clearFolderPath: () => void;
  logout: () => Promise<void>;
};

const DataContext = createContext<AppData | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const [folderPath, setFolderPathState] = useState<string | null>(null);
  const [resources, setResources] = useState<ResourceTree>({});
  const [isScanningResources, setIsScanningResources] = useState(false);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user = useMemo<DiscordUser | null>(() => {
    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      discordId: session.user.id,
      accessToken: session.accessToken ?? null,
    };
  }, [session]);

  useEffect(() => {
    const savedFolderPath = localStorage.getItem("folderPath");

    if (savedFolderPath) {
      setFolderPathState(savedFolderPath);
    }
  }, []);

  useEffect(() => {
    if (!folderPath) {
      setResources({});
      return;
    }

    const loadResources = async () => {
      try {
        setResources({});
        setIsScanningResources(true);

        const res = await window.electronAPI.scanResources(folderPath);
        setResources(res);
      } finally {
        setIsScanningResources(false);
      }
    };

    loadResources();
  }, [folderPath]);

  const setFolderPath = async (path: string | null) => {
    setFolderPathState(path);

    if (path) {
      localStorage.setItem("folderPath", path);
    } else {
      localStorage.removeItem("folderPath");
    }
  };

  const clearFolderPath = () => {
    setFolderPath(null);
  };

  const logout = async () => {
    setFolderPath(null);

    await signOut({
      redirect: false,
    });
  };

  const value = useMemo(
    () => ({
      user,
      folderPath,
      resources,
      isScanningResources,
      isAuthenticated,
      isLoading,
      setFolderPath,
      clearFolderPath,
      logout,
    }),
    [user, folderPath, resources, isAuthenticated, isLoading],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData debe utilizarse dentro de un DataProvider");
  }

  return context;
}
