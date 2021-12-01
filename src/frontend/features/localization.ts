const LANGUAGE = 'en'; /* TODO: [UX] that value should be set based on user-browser settings */

function getLocalizedDate(date: Date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const dtf = new Intl.DateTimeFormat(LANGUAGE, {
    dateStyle: 'medium',
  });

  return dtf.format(date);
}

export { getLocalizedDate };
