import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PaginationParams {
  limit: number;
  page: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationParams => {
    // console.log('pagination data', data);
    // console.log('pagination ctx', ctx);
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const limit = Math.max(0, parseInt(query.limit, 10) || 0);
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    return { limit, page };
  },
);
