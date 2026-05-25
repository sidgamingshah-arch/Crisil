const db = require('../config/database');

class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
    this.db = db;
  }

  findById(id) {
    return this.db(this.table).where({ id }).first();
  }

  async findAll({ limit = 20, offset = 0, orderBy = 'created_at', order = 'desc' } = {}) {
    return this.db(this.table).orderBy(orderBy, order).limit(limit).offset(offset);
  }

  async count(where = {}) {
    const [{ count }] = await this.db(this.table).where(where).count('id as count');
    return parseInt(count);
  }

  async create(data) {
    const [row] = await this.db(this.table).insert(data).returning('*');
    return row;
  }

  async update(id, data) {
    const [row] = await this.db(this.table)
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return row;
  }

  async delete(id) {
    return this.db(this.table).where({ id }).delete();
  }

  async findOne(where) {
    return this.db(this.table).where(where).first();
  }

  async findWhere(where, { limit = 20, offset = 0 } = {}) {
    return this.db(this.table).where(where).limit(limit).offset(offset);
  }
}

module.exports = BaseRepository;
