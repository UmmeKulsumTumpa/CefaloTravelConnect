// server/src/app/config/dummyData.config.ts

export const DUMMY_GEOLOCATION = {
  geolocation_id: '11111111-1111-1111-1111-111111111111',
  latitude: 23.8103,
  longitude: 90.4125,
  address: 'Dhaka, Bangladesh',
};

export const DUMMY_DESTINATION = {
  destination_id: '9d11bd67-bc53-46a1-afc9-b4f1de50930a',
  name: 'Dummy Destination',
  geolocation: DUMMY_GEOLOCATION,
  notes: 'This is a dummy destination for testing.',
  status: 'Planned',
};

export const DUMMY_IMAGE_URLS = [
  'https://via.placeholder.com/600x400?text=Image+1',
  'https://via.placeholder.com/600x400?text=Image+2',
];
