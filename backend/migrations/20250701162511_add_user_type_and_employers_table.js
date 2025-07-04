/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.enu('user_type', ['jobseeker', 'employer']).notNullable().defaultTo('jobseeker');
    }),
    knex.schema.createTable('employers', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('company_name').notNullable();
      table.string('contact_person').notNullable();
      table.string('address').notNullable();
      table.string('phone').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.dropColumn('user_type');
    }),
    knex.schema.dropTable('employers')
  ]);
};
