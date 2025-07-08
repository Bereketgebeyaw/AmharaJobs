/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('applications', function(table) {
    // Add new columns for document references
    table.integer('resume_document_id').unsigned().nullable().references('id').inTable('user_documents').onDelete('SET NULL');
    table.integer('cover_letter_document_id').unsigned().nullable().references('id').inTable('user_documents').onDelete('SET NULL');
    table.text('application_notes').nullable(); // Additional notes for this specific application
    
    // Keep the old columns for backward compatibility during migration
    // They can be removed in a future migration if needed
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('applications', function(table) {
    table.dropColumn('resume_document_id');
    table.dropColumn('cover_letter_document_id');
    table.dropColumn('application_notes');
  });
}; 