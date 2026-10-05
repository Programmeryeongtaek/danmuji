export type NavItemKey = "home" | "economy" | "invest" | "records" | "language" | "selfCapital";

export interface NavItem {
  key: NavItemKey;
  label: string;
  icon: "home" | "chart" | "checklist" | "pencil" | "language" | "hexagon";
}

export interface SummaryCardItem {
  title: string;
  href: string;
}

export interface SummaryCard {
  key: string;
  title: string;
  icon: "news" | "pencil" | "book" | "Languages" | "hexagon";
  items: SummaryCardItem[];
  moreHref: string;
}