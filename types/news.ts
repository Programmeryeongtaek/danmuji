export interface NewsSummary {
  id: string;
  user_id: string | null;
  title: string;
  source: string | null;
  summary: string;
  article_url: string | null;
  published_date: string | null;
  created_at: string;
}

export interface NewsSummaryWithRelatedCount extends NewsSummary {
  relatedCount: number;
  relatedTerms: string[];
}

export type NewsSummaryFormValues = Pick<NewsSummary, 'title' | 'source' | 'summary' | 'article_url' | 'published_date'>;