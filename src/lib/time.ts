const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const formatters = new Map<string, Intl.DateTimeFormat>();

export function localParts(now: Date, timeZone: string) {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    formatters.set(timeZone, formatter);
  }
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    second: Number(parts.second),
  };
}

export function validDate(value: string): boolean {
  if (!DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function validTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function nextDate(value: string): string {
  if (!validDate(value)) throw new Error(`Fecha inválida: ${value}`);
  const day = new Date(`${value}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

/** Interpreta una hora de pared en la zona del dueño, independiente de la zona del visitante.
 * Horas inexistentes o ambiguas por cambios de horario se rechazan en la configuración. */
export function zonedEpoch(value: string, timeZone: string): number {
  if (
    !DATETIME.test(value) ||
    !validDate(value.slice(0, 10)) ||
    !validTime(value.slice(11))
  ) {
    throw new Error(`Fecha/hora inválida: ${value}`);
  }
  const wallEpoch = Date.parse(`${value}:00Z`);
  const offsets = new Set<number>();
  for (let hour = -36; hour <= 36; hour += 6) {
    const sample = wallEpoch + hour * 3_600_000;
    const parts = localParts(new Date(sample), timeZone);
    offsets.add(
      Date.parse(
        `${parts.date}T${parts.time}:${String(parts.second).padStart(2, '0')}Z`,
      ) - sample,
    );
  }
  const matches = [...offsets]
    .map((offset) => wallEpoch - offset)
    .filter((epoch) => {
      const p = localParts(new Date(epoch), timeZone);
      return `${p.date}T${p.time}` === value;
    });
  if (matches.length !== 1)
    throw new Error(`Hora inexistente o ambigua en ${timeZone}: ${value}`);
  return matches[0]!;
}

export function periodBounds(
  period: { mode: 'dates' | 'datetime'; start: string; end: string },
  timeZone: string,
) {
  if (period.mode === 'dates') {
    if (!validDate(period.start) || !validDate(period.end))
      throw new Error('Se esperan fechas YYYY-MM-DD');
    return {
      start: zonedEpoch(`${period.start}T00:00`, timeZone),
      end: zonedEpoch(`${nextDate(period.end)}T00:00`, timeZone),
    };
  }
  return {
    start: zonedEpoch(period.start, timeZone),
    end: zonedEpoch(period.end, timeZone),
  };
}

export function readableDate(value: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`));
}
