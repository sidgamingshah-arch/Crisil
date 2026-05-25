exports.seed = async (knex) => {
  await knex('activities').del();

  const destinations = await knex('destinations').select('id', 'name', 'currency_code');
  const byName = Object.fromEntries(destinations.map((d) => [d.name, d]));

  const activities = [
    {
      destination: 'Eiffel Tower Area',
      name: 'Eiffel Tower Skip-the-Line Tour',
      category: 'tour',
      base_price: 45.00,
      min_group_size: 2,
      max_group_size: 15,
      duration_minutes: 120,
      discount_tiers: [
        { min_participants: 3, discount_percent: 10 },
        { min_participants: 6, discount_percent: 20 },
        { min_participants: 10, discount_percent: 30 },
      ],
    },
    {
      destination: 'Eiffel Tower Area',
      name: 'Seine River Cruise',
      category: 'cruise',
      base_price: 25.00,
      min_group_size: 2,
      max_group_size: 20,
      duration_minutes: 60,
      discount_tiers: [
        { min_participants: 4, discount_percent: 15 },
        { min_participants: 8, discount_percent: 25 },
      ],
    },
    {
      destination: 'Shibuya Crossing',
      name: 'Tokyo Street Food Walking Tour',
      category: 'food',
      base_price: 55.00,
      min_group_size: 2,
      max_group_size: 12,
      duration_minutes: 180,
      discount_tiers: [
        { min_participants: 3, discount_percent: 10 },
        { min_participants: 6, discount_percent: 20 },
        { min_participants: 10, discount_percent: 35 },
      ],
    },
    {
      destination: 'Shibuya Crossing',
      name: 'Sushi Making Class',
      category: 'workshop',
      base_price: 80.00,
      min_group_size: 2,
      max_group_size: 8,
      duration_minutes: 150,
      discount_tiers: [
        { min_participants: 4, discount_percent: 20 },
        { min_participants: 8, discount_percent: 35 },
      ],
    },
    {
      destination: 'Colosseum',
      name: 'Colosseum Underground Tour',
      category: 'cultural',
      base_price: 60.00,
      min_group_size: 2,
      max_group_size: 12,
      duration_minutes: 150,
      discount_tiers: [
        { min_participants: 4, discount_percent: 15 },
        { min_participants: 8, discount_percent: 25 },
        { min_participants: 12, discount_percent: 35 },
      ],
    },
    {
      destination: 'Taj Mahal',
      name: 'Sunrise Taj Mahal Tour with Agra Fort',
      category: 'cultural',
      base_price: 35.00,
      min_group_size: 2,
      max_group_size: 15,
      duration_minutes: 300,
      discount_tiers: [
        { min_participants: 4, discount_percent: 20 },
        { min_participants: 8, discount_percent: 30 },
      ],
    },
    {
      destination: 'Angkor Wat',
      name: 'Angkor Wat Sunrise Tuk-Tuk Tour',
      category: 'tour',
      base_price: 30.00,
      min_group_size: 2,
      max_group_size: 10,
      duration_minutes: 480,
      discount_tiers: [
        { min_participants: 3, discount_percent: 15 },
        { min_participants: 6, discount_percent: 30 },
      ],
    },
    {
      destination: 'Machu Picchu',
      name: 'Inca Trail to Machu Picchu',
      category: 'adventure',
      base_price: 200.00,
      min_group_size: 2,
      max_group_size: 16,
      duration_minutes: 1440,
      discount_tiers: [
        { min_participants: 4, discount_percent: 10 },
        { min_participants: 8, discount_percent: 18 },
        { min_participants: 12, discount_percent: 25 },
      ],
    },
    {
      destination: 'Santorini Caldera',
      name: 'Caldera Sunset Catamaran Cruise',
      category: 'cruise',
      base_price: 95.00,
      min_group_size: 4,
      max_group_size: 20,
      duration_minutes: 300,
      discount_tiers: [
        { min_participants: 6, discount_percent: 15 },
        { min_participants: 12, discount_percent: 25 },
        { min_participants: 20, discount_percent: 35 },
      ],
    },
    {
      destination: 'Bali Ubud Rice Terraces',
      name: 'Bali Cycling & Rice Terrace Tour',
      category: 'adventure',
      base_price: 40.00,
      min_group_size: 2,
      max_group_size: 15,
      duration_minutes: 360,
      discount_tiers: [
        { min_participants: 4, discount_percent: 20 },
        { min_participants: 8, discount_percent: 35 },
      ],
    },
  ];

  for (const act of activities) {
    const dest = byName[act.destination];
    if (!dest) continue;
    await knex('activities').insert({
      destination_id: dest.id,
      name: act.name,
      category: act.category,
      base_price: act.base_price,
      currency_code: dest.currency_code,
      min_group_size: act.min_group_size,
      max_group_size: act.max_group_size,
      duration_minutes: act.duration_minutes,
      discount_tiers: JSON.stringify(act.discount_tiers),
      is_active: true,
    });
  }
};
