/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('employers', function(table) {
    table.string('company_type').notNullable().defaultTo('Private');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('employers', function(table) {
    table.dropColumn('company_type');
  });
};
