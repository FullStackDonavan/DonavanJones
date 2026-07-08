export interface IReview {
  id: number;
  userId: number;
  productSlug: string;
  rating: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
}

export interface IReviewSummary {
  productSlug: string;
  average: number;
  count: number;
}
