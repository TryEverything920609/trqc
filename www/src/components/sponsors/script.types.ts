// http://json2ts.com/

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface SponsorEntity {
  id: string;
  name: string | null;
  login: string;
  websiteUrl: string | null;
  avatarUrl: string;
}

export interface Tier {
  id: string;
  monthlyPriceInDollars: number;
}

export interface Node {
  createdAt: string;
  sponsorEntity: SponsorEntity;
  tier: Tier;
  privacyLevel: string;
}

export interface Edge {
  node: Node;
}

export interface SponsorshipsAsMaintainer {
  pageInfo: PageInfo;
  edges: Edge[];
}

export interface Viewer {
  sponsorshipsAsMaintainer: SponsorshipsAsMaintainer;
}

export interface RootObject {
  viewer: Viewer;
}
