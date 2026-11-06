import type { NavigationTree, NavTreeTab } from "@/lib/tree-store";

type PublicNavigationPayload = {
  tree?: NavigationTree;
  tabs?: NavTreeTab[];
  solutionGroups?: { title: string; links: string[] }[];
  productGroups?: { title: string; links: string[] }[];
  companyGroups?: { title: string; links: string[] }[];
  industries?: { title: string; intro?: string; description?: string; items: string[] }[];
  solutions?: { title: string; slug?: string; isPublished?: boolean }[];
};

const CACHE_MS = 15_000;
let cachedPayload: PublicNavigationPayload | null = null;
let expiresAt = 0;
let pendingRequest: Promise<PublicNavigationPayload | null> | null = null;

/** Share the same short-lived navigation request between the navbar, footer, and home page. */
export function getPublicNavigation(): Promise<PublicNavigationPayload | null> {
  if (cachedPayload && Date.now() < expiresAt) return Promise.resolve(cachedPayload);
  if (pendingRequest) return pendingRequest;

  pendingRequest = fetch("/api/content/nav", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) return null;
      const json = await response.json();
      if (!json.success || !json.data) return null;
      cachedPayload = json.data as PublicNavigationPayload;
      expiresAt = Date.now() + CACHE_MS;
      return cachedPayload;
    })
    .catch(() => null)
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}
