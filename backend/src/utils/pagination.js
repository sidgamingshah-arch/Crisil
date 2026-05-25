const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(query) {
  const limit = Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(query.offset) || 0;
  const page = Math.max(parseInt(query.page) || 1, 1);
  const resolvedOffset = query.offset !== undefined ? offset : (page - 1) * limit;
  return { limit, offset: resolvedOffset, page };
}

function buildPaginationMeta(total, limit, offset) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    limit,
    offset,
    current_page: currentPage,
    total_pages: totalPages,
    has_next: offset + limit < total,
    has_prev: offset > 0,
  };
}

module.exports = { parsePagination, buildPaginationMeta };
