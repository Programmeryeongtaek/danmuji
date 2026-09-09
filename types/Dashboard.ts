export type NavItemKey = "home" | "economy" | "records" | "language";
 
export interface NavItem {
  key: NavItemKey;
  label: string;
  icon: "home" | "chart" | "pencil" | "language";
}
 
export interface SummaryCardItem {
  title: string;
  href: string;
}
 
export interface SummaryCard {
  key: string;
  title: string;
  icon: "news" | "pencil" | "book" | "Languages";
  items: SummaryCardItem[];
  moreHref: string;
}