/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('applications', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('job_id').unsigned().notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.integer('resume_document_id').unsigned().nullable();
    table.integer('cover_letter_document_id').unsigned().nullable();
    table.text('application_notes').nullable();
    table.enu('status', ['pending', 'reviewed', 'shortlisted', 'interviewed', 'hired', 'rejected', 'withdrawn']).defaultTo('pending');
    table.text('employer_notes').nullable();
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure a user can only apply once to a job
    table.unique(['job_id', 'user_id']);
    
    // Indexes for better performance
    table.index(['user_id']);
    table.index(['job_id']);
    table.index(['status']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('applications');
}; 