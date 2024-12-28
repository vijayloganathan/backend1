export const getAttendanceData = `SELECT
  *
FROM
  public.test
WHERE
  TO_CHAR(TO_DATE(LEFT($1, 10), 'DD/MM/YYYY'), 'DD/MM/YYYY') = TO_CHAR(
    TO_DATE(LEFT("punch_time", 10), 'DD-MM-YYY'),
    'DD/MM/YYYY'
  )`;

export const getSession = `SELECT * FROM public."refCustTime" WHERE "refDeleteAt" is null
    OR "refDeleteAt" = 0`;

export const searchUser = `SELECT
  u."refStId",u."refSCustId",
  u."refStFName",
  u."refStLName",
  TO_CHAR(u."refStDOB", 'DD/MM/YYYY') AS "refStDOB",  -- Format the date
  uc."refCtMobile",
  uc."refCtEmail",
  rp."refPackageName",
  pt."refTime"
FROM
  public.users u
  INNER JOIN public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
  INNER JOIN public."refUsersDomain" ud ON CAST(u."refStId" AS INTEGER) = ud."refStId"
  LEFT JOIN public."refPackage" rp ON CAST (u."refSessionMode" AS INTEGER ) = rp."refPaId"
  LEFT JOIN public."refPaTiming" pt ON CAST (u."refTimingId" AS INTEGER ) = pt."refTimeId"
WHERE
  CONCAT(
    u."refSCustId",
    ' ',
    u."refStFName",
    ' ',
    uc."refCtMobile",
    ' ',
    uc."refCtEmail",
    ' ',
    ud."refUserName"
  ) LIKE '%' || $1 || '%';
`;

// export const userAttendance = `WITH
//   cte AS (
//     SELECT
//       TO_CHAR(punch_time, 'DD/MM/YYYY, HH:MI:SS PM') AS attendance,
//       punch_time,
//       LAG(punch_time) OVER (
//         PARTITION BY
//           TO_CHAR(punch_time, 'DD/MM/YYYY')
//         ORDER BY
//           punch_time
//       ) AS previous_punch_time
//     FROM
//       public."iclock_transaction"
//     WHERE
//       emp_code = $1
//       AND EXTRACT(
//         MONTH
//         FROM
//           punch_time
//       ) = EXTRACT(
//         MONTH
//         FROM
//           TO_TIMESTAMP($2, 'DD/MM/YYYY, HH:MI:SS PM')
//       )
//       AND EXTRACT(
//         YEAR
//         FROM
//           punch_time
//       ) = EXTRACT(
//         YEAR
//         FROM
//           TO_TIMESTAMP($2, 'DD/MM/YYYY, HH:MI:SS PM')
//       )
//   )
// SELECT
//   TO_CHAR(punch_time, 'DD/MM/YYYY, HH:MI:SS PM') AS formatted_punch_time
// FROM
//   cte
// WHERE
//   previous_punch_time IS NULL
//   OR EXTRACT(
//     EPOCH
//     FROM
//       (punch_time - previous_punch_time)
//   ) > 600;`;
export const userAttendance = `WITH
  cte AS (
    SELECT
      TO_CHAR(punch_time, 'DD/MM/YYYY, HH:MI:SS PM') AS attendance,
      punch_time,
      LAG(punch_time) OVER (
        PARTITION BY
          TO_CHAR(punch_time, 'DD/MM/YYYY')
        ORDER BY
          punch_time
      ) AS previous_punch_time
    FROM
      public."iclock_transaction"
    WHERE
      emp_code = $1
      AND EXTRACT(
        MONTH
        FROM
          punch_time
      ) = EXTRACT(
        MONTH
        FROM
          TO_TIMESTAMP($2, 'Month YYYY')
      )
      AND EXTRACT(
        YEAR
        FROM
          punch_time
      ) = EXTRACT(
        YEAR
        FROM
          TO_TIMESTAMP($2, 'Month YYYY')
      )
  )
SELECT
  TO_CHAR(punch_time, 'DD/MM/YYYY, HH:MI:SS PM') AS formatted_punch_time
FROM
  cte
WHERE
  previous_punch_time IS NULL
  OR EXTRACT(
    EPOCH
    FROM
      (punch_time - previous_punch_time)
  ) > 600;
`;

// session attendance Query

export const getRegisterCount = `SELECT
  COUNT(u."refTimingId") AS user_count,
  rp."refPaId", rp."refPackageName", rp."refTimingId", rp."refSessionDays", rp."refSessionMode",
  sd."refSDId", sd."refDays",
  pt."refTimeId", pt."refTime"
FROM
  public."refPackage" rp
  INNER JOIN public."refPaTiming" pt 
    ON pt."refTimeId" = ANY (
      string_to_array(
        REPLACE(REPLACE(rp."refTimingId", '{', ''), '}', ''),
        ','
      )::INTEGER[]
    )
  INNER JOIN public."refSessionDays" sd 
    ON sd."refSDId" = ANY (
      string_to_array(
        REPLACE(REPLACE(rp."refSessionDays", '{', ''), '}',''),
        ','
      )::INTEGER[]
    )
  LEFT JOIN public.users u 
    ON CAST(u."refTimingId" AS INTEGER) = pt."refTimeId" 
   AND CAST(u."refSessionMode" AS INTEGER) = rp."refPaId" 
WHERE
  rp."refSessionMode" IN ('Offline & Online', $1) 
  AND sd."refDays" IN (
    'All Days', 
    TRIM(TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'), 'Day')),
    CASE 
      WHEN EXTRACT(DOW FROM TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM')) BETWEEN 1 AND 5 THEN 'Weekdays'
      WHEN EXTRACT(DOW FROM TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM')) IN (0, 6) THEN 'Weekend'
      ELSE NULL
    END
  )
  AND (rp."refDeleteAt" IS NULL OR rp."refDeleteAt" = 0) 
  AND rp."refBranchId" = $3
GROUP BY 
  rp."refPaId", rp."refTimingId", rp."refSessionDays", rp."refSessionMode",
  sd."refSDId", sd."refDays",
  pt."refTimeId", pt."refTime";`;

export const getOfflineCount = `SELECT 
    COUNT(DISTINCT emp_code) AS attend_count
FROM 
    public.iclock_transaction
WHERE 
    DATE(punch_time) = DATE(TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM'))
    AND punch_time >= TO_TIMESTAMP(SPLIT_PART($1, ',', 1) || ' ' || SPLIT_PART($2, ' to ', 1), 'DD/MM/YYYY HH12:MI AM') - INTERVAL '30 minutes'
    AND punch_time <= TO_TIMESTAMP(SPLIT_PART($1, ',', 1) || ' ' || SPLIT_PART($2, ' to ', 1), 'DD/MM/YYYY HH12:MI AM') + INTERVAL '30 minutes';`;

export const getPackageTimingOptions = `SELECT
  rp."refPaId", 
  rp."refPackageName", 
  pt."refTimeId", 
  pt."refTime",
  rp."refPaId" || ',' || pt."refTimeId" AS "value"
FROM
  public."refPackage" rp
  INNER JOIN public."refPaTiming" pt 
    ON pt."refTimeId" = ANY (
      string_to_array(
        REPLACE(REPLACE(rp."refTimingId", '{', ''), '}', ''),
        ','
      )::INTEGER[]
    )
WHERE
  rp."refBranchId"=$1 AND (rp."refDeleteAt" IS NULL OR rp."refDeleteAt" = 0)
  AND rp."refSessionMode" IN ('Offline & Online',$2)
ORDER BY
  rp."refPaId",
  TO_TIMESTAMP(SUBSTRING(pt."refTime" FROM '^[0-9:APM ]+'), 'HH:MI AM');`;
export const getPackageTimingOptionsPerDay = `SELECT
  rp."refPaId",
  rp."refPackageName",
  pt."refTimeId",
  pt."refTime",
  rp."refPaId" || ',' || pt."refTimeId" AS "value", sd."refSDId",
  sd."refDays"
FROM
  public."refPackage" rp
  INNER JOIN public."refPaTiming" pt ON pt."refTimeId" = ANY (
    string_to_array(
      REPLACE(REPLACE(rp."refTimingId", '{', ''), '}', ''),
      ','
    )::INTEGER[]
  )
  INNER JOIN public."refSessionDays" sd ON sd."refSDId" = ANY (
    string_to_array(
      REPLACE(REPLACE(rp."refSessionDays", '{', ''), '}', ''),
      ','
    )::INTEGER[]
  )
WHERE
  rp."refBranchId" = $1
  AND
  (rp."refSessionMode" IN ('Offline & Online',$3))
  AND (
    rp."refDeleteAt" IS NULL
    OR rp."refDeleteAt" = 0
  )
  AND sd."refDays" IN (
    'All Days',
    TRIM(
      TO_CHAR(
        TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'),
        'Day'
      )
    )
  )
ORDER BY
  TO_TIMESTAMP(
    SUBSTRING(
      pt."refTime"
      FROM
        '^[0-9:APM ]+'
    ),
    'HH:MI AM'
  );`;

export const getPackageTime = `SELECT
  rp."refPaId",
  rp."refPackageName",
  rp."refSessionMode",
  rpt."refTimeId",
  rpt."refTime",
  STRING_AGG(sd."refDays", ' , ') AS "refDays",
  b."refBranchName"
FROM
  public."refPackage" rp
  INNER JOIN LATERAL UNNEST(rp."refTimingId"::INT[]) AS t (refTimingId) ON true
  INNER JOIN public."refPaTiming" rpt ON rpt."refTimeId" = t.refTimingId
  INNER JOIN public."refSessionDays" sd 
    ON sd."refSDId" = ANY (
      string_to_array(
        REPLACE(REPLACE(rp."refSessionDays", '{', ''), '}',''),
        ','
      )::INTEGER[]
    )
    INNER JOIN public.branch b ON CAST (rp."refBranchId" AS INTEGER) = b."refbranchId"
WHERE
  rp."refPaId" = $1
  AND t.refTimingId = $2
  AND (
    rp."refDeleteAt" IS NULL
    OR rp."refDeleteAt" = 0
  )
  AND rp."refSessionMode" IN ('Offline & Online', $3)
  
GROUP BY
  rp."refPaId",
  rp."refPackageName",
  rp."refSessionMode",
  rpt."refTimeId",
  rpt."refTime",
  b."refBranchName";`;

export const getDateWiseAttendance = `SELECT
  emp_code,
  TO_CHAR(MIN(punch_time), 'DD/MM/YYYY') AS punch_date,  -- Only the date part
  TO_CHAR(MIN(punch_time), 'HH12:MI:SS AM') AS punch_time,  -- Only the time part
  TO_CHAR(
    (
      TO_TIMESTAMP(SPLIT_PART($2, ' to ', 1), 'HH12:MI AM') - INTERVAL '30 minutes'
    )::time,
    'HH12:MI AM'
  ) AS interval_start,
  TO_CHAR(
    (
      TO_TIMESTAMP(SPLIT_PART($2, ' to ', 1), 'HH12:MI AM') + INTERVAL '30 minutes'
    )::time,
    'HH12:MI AM'
  ) AS interval_end
FROM
  public.iclock_transaction
WHERE
  DATE(punch_time) = DATE(TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM'))
  AND punch_time::time >= (
    TO_TIMESTAMP(SPLIT_PART($2, ' to ', 1), 'HH12:MI AM')::time - INTERVAL '30 minutes'
  )
  AND punch_time::time <= (
    TO_TIMESTAMP(SPLIT_PART($2, ' to ', 2), 'HH12:MI AM')::time + INTERVAL '30 minutes'
  )
  AND emp_code NOT LIKE '%S%'
GROUP BY
  emp_code;`;

export const getUserName = `SELECT "refStFName","refStLName","refSCustId" FROM public.users`;
