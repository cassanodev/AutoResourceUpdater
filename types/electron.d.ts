export {};

declare global {
  interface Window {
    electronAPI: {
      selectFolder(): Promise<string | null>;
      openExternal(url: string): Promise<void>;
      getPathForFile(file: File): string;
      scanResources(folder: string): Promise<ResourceTree>;

      minimize(): Promise<void>;
      maximize(): Promise<void>;
      close(): Promise<void>;
    };
  }
}