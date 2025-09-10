export interface PageQuery {
  page?: number; // 1-based
  limit?: number; // page size
  sort?: string; // e.g. "createdAt:desc,name:asc"
}

export interface PageInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Paginated<T> {
  items: T[];
  pageInfo: PageInfo;
}

