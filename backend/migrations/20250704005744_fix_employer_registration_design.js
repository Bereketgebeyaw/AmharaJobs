/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    // Remove company_name from employers (it's in users.fullname)
    knex.schema.alterTable('employers', function(table) {
      table.dropColumn('company_name');
    }),
    
    // Remove phone from employers table (it's already in users)
    knex.schema.alterTable('employers', function(table) {
      table.dropColumn('phone');
    })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    // Add company_name back to employers table
    knex.schema.alterTable('employers', function(table) {
      table.string('company_name').notNullable();
    }),
    
    // Add phone back to employers table
    knex.schema.alterTable('employers', function(table) {
      table.string('phone').notNullable();
    })
  ]);
};
