export const Roles = [
  'No registrat/da',
  'Usuari final',
  'Doctor/a',
  'Administrator/a de llicències',
  'Institució de recerca'
];

export function roleToNumber(roleAsString) {
  return Object.keys(Roles).find(key => Roles[key] === roleAsString);
}
