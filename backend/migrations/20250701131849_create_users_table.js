/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('fullname').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable();
    table.string('password_hash').notNullable();
    table.boolean('is_verified').notNullable().defaultTo(false);
    table.string('verification_token').nullable();
    table.text('user_type').notNullable().defaultTo('jobseeker');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  // Add check constraint for user_type
  await knex.raw(`ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('jobseeker', 'employer', 'admin'))`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('users');
};
