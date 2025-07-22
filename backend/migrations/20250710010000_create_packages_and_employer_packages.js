/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('packages', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('price').notNullable(); // in birr
      table.integer('job_post_limit').notNullable();
      table.text('description');
      table.json('features');
      table.timestamps(true, true);
    })
    .createTable('employer_packages', function(table) {
      table.increments('id').primary();
      table.integer('employer_id').unsigned().notNullable().references('id').inTable('employers').onDelete('CASCADE');
      table.integer('package_id').unsigned().notNullable().references('id').inTable('packages').onDelete('CASCADE');
      table.date('start_date').notNullable();
      table.date('end_date');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('employer_packages')
    .dropTableIfExists('packages');
}; 