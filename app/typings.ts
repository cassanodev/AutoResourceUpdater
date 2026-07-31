export type ResourceStatus = "up-to-date" | "update-available";
export type ResourceSource = "github" | "manual";

export interface ResourceLeaf {
  version: string;
  latestVersion: string;
  source: ResourceSource;
  status: ResourceStatus;
}

export interface ResourceTree {
  [key: string]: ResourceTree | ResourceLeaf;
}

export interface DiscordUser {
  id: string;
  name: string | null;
  image: string | null;
  discordId: string | null;
  accessToken: string | null;
}