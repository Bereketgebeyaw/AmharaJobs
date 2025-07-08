/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_profiles', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Basic information (also stored in users table for consistency)
    table.string('fullname').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    
    // Extended profile information
    table.text('address').nullable();
    table.date('date_of_birth').nullable();
    table.enu('gender', ['male', 'female', 'other']).nullable();
    table.text('skills').nullable(); // Skills and competencies
    table.text('experience').nullable(); // Work experience
    table.text('education').nullable(); // Educational background
    table.text('bio').nullable(); // Personal bio/description
    table.string('linkedin_url').nullable();
    table.string('website_url').nullable();
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure one profile per user
    table.unique(['user_id']);
    
    // Indexes for better performance
    table.index(['user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_profiles');
}; 