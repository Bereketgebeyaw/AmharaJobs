exports.up = function(knex) {
  return knex.schema.alterTable('user_documents', function(table) {
    table.string('mime_type', 255);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('user_documents', function(table) {
    table.dropColumn('mime_type');
  });
}; 