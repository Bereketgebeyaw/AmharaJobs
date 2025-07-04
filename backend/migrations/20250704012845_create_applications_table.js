/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('applications', function(table) {
    table.increments('id').primary();
    table.integer('job_id').unsigned().notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.integer('jobseeker_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enu('status', ['pending', 'reviewed', 'shortlisted', 'interviewed', 'hired', 'rejected']).defaultTo('pending');
    table.text('cover_letter').nullable();
    table.string('resume_url').nullable();
    table.text('employer_notes').nullable();
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure a jobseeker can only apply once to a job
    table.unique(['job_id', 'jobseeker_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('applications');
};
