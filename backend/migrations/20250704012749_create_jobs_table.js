/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('jobs', function(table) {
    table.increments('id').primary();
    table.integer('employer_id').unsigned().notNullable().references('id').inTable('employers').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.text('requirements').notNullable();
    table.string('location').notNullable();
    table.string('job_type').notNullable(); // Full-time, Part-time, Contract, Internship
    table.string('experience_level').notNullable(); // Entry, Mid, Senior, Executive
    table.string('salary_range').nullable();
    table.string('benefits').nullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_featured').defaultTo(false);
    table.string('status').defaultTo('active'); // active, inactive, draft
    table.timestamp('application_deadline').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('jobs');
};
