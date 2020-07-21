export interface PaperVersions {
  project: string;
  versions: string[];
}
export interface PaperLatestVersion {
  project: string;
  version: string;
  build: string;
}

export interface CraftiumData {
  version: string;
  last_update: number;
}
