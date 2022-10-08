export type GcpProjectId = string;

export class ConsolePage {
  constructor(
    readonly projectId: GcpProjectId,
    readonly name: string,
    readonly url: URL,
    readonly lastVisitTime: number
  ) {}

  favicon(): string {
    return `chrome://favicon/${this.url}`;
  }

  displayName(): string {
    const splitted = this.name.split(` – ${this.projectId}`);
    if (splitted.length > 0) {
      const elems = splitted[0].split(" – ");
      return elems.reverse().join(" | ");
    }
    return this.name;
  }

  detailPart(): string {
    const keyValues = chunk(this.url.pathname.split("/").slice(2), 2);
    return (
      keyValues
        .map((kv) => `${kv[0]}${kv.length == 2 ? "=" + kv[1] : ""}`)
        .join(" ") +
      " " +
      [...this.url.searchParams.entries()]
        .filter((kv) => kv[0] != "project")
        .map((kv) => `${kv[0]}=${kv[1]}`)
        .join(" ")
    );
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
          // どのページもロード時に一旦この名前になり、その後切り替わる
          .filter((p) => p.title !== "Google Cloud console")
          .map((p) => {
            const url = new URL(p.url!);
            const projectId = url.searchParams.get("project") ?? "";
            p.lastVisitTime;
            return new ConsolePage(
              projectId,
              p.title ?? "",
              url,
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
        let concat = `${p.projectId} ${p.name} ${p.url.toString()}`;
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

function chunk<T extends any[]>(arr: T, size: number): T[][] {
  return arr.reduce(
    (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
    [] as T[][]
  );
}
