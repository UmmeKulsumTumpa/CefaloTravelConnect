import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('destinations').del();
  await knex('destinations').insert([
    {
      destination_id: '9d11bd67-bc53-46a1-afc9-b4f1de50930a',
      name: 'Paris',
      geolocation_id: null,
      notes: 'A beautiful city in France.',
      status: 'Planned',
      created_at: knex.fn.now()
    }
  ]);
}