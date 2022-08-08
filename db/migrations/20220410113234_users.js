exports.up = async knex => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('email').unique()
    table.string('nom')
    table.string('prenom')
    table.string('password')
    table.string('SIRET').unique()
    table.string('nom_entreprise')
    table.string('role')
    table.string('code')
    table.string('valid')
    table.date('created_at')
  }
  )
}

exports.down = async knex => {
  await knex.schema.dropTableIfExists('users')
}
