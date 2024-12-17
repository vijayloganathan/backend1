export const getAttendanceData = `SELECT
  *
FROM
  public.test
WHERE
  TO_CHAR(TO_DATE(LEFT($1, 10), 'DD/MM/YYYY'), 'DD/MM/YYYY') = TO_CHAR(
    TO_DATE(LEFT("punch_time", 10), 'DD-MM-YYY'),
    'DD/MM/YYYY'
  )`;
