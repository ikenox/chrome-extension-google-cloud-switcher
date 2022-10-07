export type GcpProjectId = string;

export class ConsolePage {
  constructor(
    readonly projectId: GcpProjectId,
    readonly name: string,
    readonly url: string,
    readonly lastVisitTime: number
  ) {}

  favicon(): string {
    return `chrome://favicon/${this.url}`;
  }
}

const googleCloudUrl = "https://console.cloud.google.com";

export function doSearch(): Promise<ConsolePage[]> {
  return new Promise((resolve) => {
    chrome.history.search(
      { text: googleCloudUrl, maxResults: 1000, startTime: 0 },
      (data) => {
        const results = data
          .filter((p) => p.url?.startsWith(googleCloudUrl) ?? false)
          .map((p) => {
            const url = new URL(p.url!);
            const projectId = url.searchParams.get("project") ?? "";
            p.lastVisitTime;
            return new ConsolePage(
              projectId,
              p.title ?? "",
              p.url!,
              p.lastVisitTime ?? 0
            );
          });
        console.log("search candidates:", results);
        resolve(results);
      }
    );
  });
}

export async function getSearcher(): Promise<Searcher> {
  const start = new Date().getTime();
  const all = await doSearch();
  let elapsed = new Date().getTime() - start;
  console.log(`history data initialized: ${elapsed}ms`);
  return new Searcher(all);
}

export class Searcher {
  constructor(readonly candidates: ConsolePage[]) {}

  query(text: string, limit: number): ConsolePage[] {
    // case-sensitive when containing upper case
    const caseSensitive = text !== text.toLowerCase();
    const splitted = text.split(" ").filter((s) => s !== "");
    return this.candidates
      .filter((p) => {
        let concat = `${p.projectId} ${p.name}`;
        if (!caseSensitive) {
          concat = concat.toLowerCase();
        }
        for (const s of splitted) {
          if (concat.includes(s)) {
            continue;
          }
          return false;
        }
        return true;
      })
      .slice(0, limit);
  }
}
