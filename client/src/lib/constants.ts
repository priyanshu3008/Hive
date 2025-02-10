export const SPACE_ADJECTIVES = [
  'Cosmic', 'Stellar', 'Lunar', 'Solar', 'Astral',
  'Nebular', 'Galactic', 'Celestial', 'Martian', 'Jovian'
];

export const SPACE_NOUNS = [
  'Explorer', 'Voyager', 'Pioneer', 'Rover', 'Pilot',
  'Navigator', 'Astronaut', 'Stargazer', 'Wanderer', 'Traveler'
];

export function generateSpaceUsername(): string {
  const adjective = SPACE_ADJECTIVES[Math.floor(Math.random() * SPACE_ADJECTIVES.length)];
  const noun = SPACE_NOUNS[Math.floor(Math.random() * SPACE_NOUNS.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${number}`;
}
