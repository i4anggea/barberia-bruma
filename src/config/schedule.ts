import type { Schedule } from './types.ts';

export const schedule: Schedule = {
  weekly: [
    { day: 0, intervals: [] },
    {
      day: 1,
      intervals: [
        ['10:00', '14:00'],
        ['16:00', '20:00'],
      ],
    },
    {
      day: 2,
      intervals: [
        ['10:00', '14:00'],
        ['16:00', '20:00'],
      ],
    },
    {
      day: 3,
      intervals: [
        ['10:00', '14:00'],
        ['16:00', '20:00'],
      ],
    },
    {
      day: 4,
      intervals: [
        ['10:00', '14:00'],
        ['16:00', '20:00'],
      ],
    },
    {
      day: 5,
      intervals: [
        ['10:00', '14:00'],
        ['16:00', '20:00'],
      ],
    },
    { day: 6, intervals: [['09:00', '17:00']] },
  ],
  exceptions: [
    {
      date: '2026-12-24',
      label: 'Horario de Nochebuena',
      intervals: [['10:00', '14:00']],
    },
    { date: '2026-12-25', label: 'Navidad', intervals: [] },
    { date: '2027-01-01', label: 'Año Nuevo', intervals: [] },
  ],
};
