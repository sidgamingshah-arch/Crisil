const { parsePagination, buildPaginationMeta } = require('../../../src/utils/pagination');

describe('parsePagination', () => {
  test('defaults', () => {
    const r = parsePagination({});
    expect(r.limit).toBe(20);
    expect(r.offset).toBe(0);
    expect(r.page).toBe(1);
  });

  test('page-based offset calculation', () => {
    const r = parsePagination({ page: '3', limit: '10' });
    expect(r.offset).toBe(20);
    expect(r.limit).toBe(10);
  });

  test('explicit offset takes precedence over page', () => {
    const r = parsePagination({ page: '3', limit: '10', offset: '5' });
    expect(r.offset).toBe(5);
  });

  test('max limit cap', () => {
    const r = parsePagination({ limit: '999' });
    expect(r.limit).toBe(100);
  });
});

describe('buildPaginationMeta', () => {
  test('first page with more results', () => {
    const meta = buildPaginationMeta(100, 20, 0);
    expect(meta.total).toBe(100);
    expect(meta.current_page).toBe(1);
    expect(meta.total_pages).toBe(5);
    expect(meta.has_next).toBe(true);
    expect(meta.has_prev).toBe(false);
  });

  test('last page', () => {
    const meta = buildPaginationMeta(100, 20, 80);
    expect(meta.has_next).toBe(false);
    expect(meta.has_prev).toBe(true);
    expect(meta.current_page).toBe(5);
  });
});
