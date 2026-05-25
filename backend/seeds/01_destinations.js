exports.seed = async (knex) => {
  await knex('destinations').del();

  const destinations = [
    { name: 'Eiffel Tower Area', city: 'Paris', country: 'France', country_code: 'FR', timezone: 'Europe/Paris', currency_code: 'EUR', lat: 48.8584, lng: 2.2945 },
    { name: 'Shibuya Crossing', city: 'Tokyo', country: 'Japan', country_code: 'JP', timezone: 'Asia/Tokyo', currency_code: 'JPY', lat: 35.6598, lng: 139.7004 },
    { name: 'Times Square', city: 'New York', country: 'USA', country_code: 'US', timezone: 'America/New_York', currency_code: 'USD', lat: 40.7580, lng: -73.9855 },
    { name: 'Colosseum', city: 'Rome', country: 'Italy', country_code: 'IT', timezone: 'Europe/Rome', currency_code: 'EUR', lat: 41.8902, lng: 12.4922 },
    { name: 'Taj Mahal', city: 'Agra', country: 'India', country_code: 'IN', timezone: 'Asia/Kolkata', currency_code: 'INR', lat: 27.1751, lng: 78.0421 },
    { name: 'Sydney Opera House', city: 'Sydney', country: 'Australia', country_code: 'AU', timezone: 'Australia/Sydney', currency_code: 'AUD', lat: -33.8568, lng: 151.2153 },
    { name: 'Machu Picchu', city: 'Cusco Region', country: 'Peru', country_code: 'PE', timezone: 'America/Lima', currency_code: 'PEN', lat: -13.1631, lng: -72.5450 },
    { name: 'Sagrada Familia', city: 'Barcelona', country: 'Spain', country_code: 'ES', timezone: 'Europe/Madrid', currency_code: 'EUR', lat: 41.4036, lng: 2.1744 },
    { name: 'Angkor Wat', city: 'Siem Reap', country: 'Cambodia', country_code: 'KH', timezone: 'Asia/Phnom_Penh', currency_code: 'USD', lat: 13.4125, lng: 103.8670 },
    { name: 'Santorini Caldera', city: 'Santorini', country: 'Greece', country_code: 'GR', timezone: 'Europe/Athens', currency_code: 'EUR', lat: 36.3932, lng: 25.4615 },
    { name: 'Burj Khalifa', city: 'Dubai', country: 'UAE', country_code: 'AE', timezone: 'Asia/Dubai', currency_code: 'AED', lat: 25.1972, lng: 55.2744 },
    { name: 'Acropolis', city: 'Athens', country: 'Greece', country_code: 'GR', timezone: 'Europe/Athens', currency_code: 'EUR', lat: 37.9715, lng: 23.7267 },
    { name: 'Bali Ubud Rice Terraces', city: 'Ubud', country: 'Indonesia', country_code: 'ID', timezone: 'Asia/Makassar', currency_code: 'IDR', lat: -8.3405, lng: 115.0920 },
    { name: 'Petra Treasury', city: 'Petra', country: 'Jordan', country_code: 'JO', timezone: 'Asia/Amman', currency_code: 'JOD', lat: 30.3285, lng: 35.4444 },
    { name: 'Christ the Redeemer', city: 'Rio de Janeiro', country: 'Brazil', country_code: 'BR', timezone: 'America/Sao_Paulo', currency_code: 'BRL', lat: -22.9519, lng: -43.2105 },
  ];

  for (const dest of destinations) {
    const { lat, lng, ...fields } = dest;
    const [row] = await knex('destinations').insert(fields).returning('id');
    const id = row.id || row;
    await knex.raw(
      'UPDATE destinations SET location = ST_MakePoint(?, ?)::geography WHERE id = ?',
      [lng, lat, id]
    );
  }
};
