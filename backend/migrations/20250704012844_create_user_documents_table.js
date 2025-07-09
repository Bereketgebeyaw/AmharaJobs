/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_documents', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enu('document_type', ['resume', 'certificate', 'cover_letter', 'other']).notNullable();
    table.string('file_name').notNullable();
    table.string('original_name').notNullable(); // Original filename
    table.string('file_path').notNullable();
    table.string('file_type').notNullable(); // MIME type
    table.integer('file_size').notNullable(); // Size in bytes
    table.string('title').nullable(); // User-friendly title (e.g., "Software Engineer Resume")
    table.text('description').nullable(); // Optional description
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_default').defaultTo(false); // Default document for this type
    table.timestamp('uploaded_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes for better performance
    table.index(['user_id', 'document_type']);
    table.index(['user_id', 'is_active']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_documents');
}; 