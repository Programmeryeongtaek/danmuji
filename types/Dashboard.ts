export type NavItemKey = "home" | "economy" | "records";
 
export interface NavItem {
  key: NavItemKey;
  label: string;
  icon: "home" | "chart" | "pencil";
}
 
export interface SummaryCardItem {
  title: string;
  href: string;
}
 
export interface SummaryCard {
  key: string;
  title: string;
  icon: "news" | "pencil" | "book";
  items: SummaryCardItem[];
  moreHref: string;
}