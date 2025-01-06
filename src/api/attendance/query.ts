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

// export const getRegisterCount = `SELECT
//   COUNT(u."refTimingId") AS user_count,
//   rp."refPaId", rp."refPackageName", rp."refTimingId", rp."refSessionDays", rp."refSessionMode",
//   sd."refSDId", sd."refDays",
//   pt."refTimeId", pt."refTime"
// FROM
//   public."refPackage" rp
//   INNER JOIN public."refPaTiming" pt 
//     ON pt."refTimeId" = ANY (
//       string_to_array(
//         REPLACE(REPLACE(rp."refTimingId", '{', ''), '}', ''),
//         ','
//       )::INTEGER[]
//     )
//   INNER JOIN public."refSessionDays" sd 
//     ON sd."refSDId" = ANY (
//       string_to_array(
//         REPLACE(REPLACE(rp."refSessionDays", '{', ''), '}',''),
//         ','
//       )::INTEGER[]
//     )
//   LEFT JOIN public.users u 
//     ON CAST(u."refTimingId" AS INTEGER) = pt."refTimeId" 
//    AND CAST(u."refSessionMode" AS INTEGER) = rp."refPaId" 
// WHERE
//   rp."refSessionMode" IN ('Offline & Online', $1) 
//   AND sd."refDays" IN (
//     'All Days', 
//     TRIM(TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'), 'Day')),
//     CASE 
//       WHEN EXTRACT(DOW FROM TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM')) BETWEEN 1 AND 5 THEN 'Weekdays'
//       WHEN EXTRACT(DOW FROM TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM')) IN (0, 6) THEN 'Weekend'
//       ELSE NULL
//     END
//   )
//   AND (rp."refDeleteAt" IS NULL OR rp."refDeleteAt" = 0) 
//   AND rp."refBranchId" = $3
// GROUP BY 
//   rp."refPaId", rp."refTimingId", rp."refSessionDays", rp."refSessionMode",
//   sd."refSDId", sd."refDays",
//   pt."refTimeId", pt."refTime";`;

// export const getOfflineCount = `SELECT
//     COUNT(DISTINCT emp_code) AS attend_count
// FROM
//     public.iclock_transaction
// WHERE
//     DATE(punch_time) = DATE(TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM'))
//     AND punch_time >= TO_TIMESTAMP(SPLIT_PART($1, ',', 1) || ' ' || SPLIT_PART($2, ' to ', 1), 'DD/MM/YYYY HH12:MI AM') - INTERVAL '30 minutes'
//     AND punch_time <= TO_TIMESTAMP(SPLIT_PART($1, ',', 1) || ' ' || SPLIT_PART($2, ' to ', 1), 'DD/MM/YYYY HH12:MI AM') + INTERVAL '30 minutes';`;

export const getOfflineCount = `
SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
        'refTimeId', time_data.refTimeId,
        'refTime', time_data.refTime,
        'usercount', time_data.usercount,
        'attendancecount', (
            SELECT COUNT(DISTINCT emp_code)
            FROM public.iclock_transaction
            WHERE 
                DATE(punch_time) = DATE(TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM'))
                AND punch_time >= TO_TIMESTAMP(SPLIT_PART($1, ',', 1) || ' ' || SPLIT_PART(time_data.refTime, ' to ', 1), 'DD/MM/YYYY HH12:MI AM') - INTERVAL '30 minutes'
                AND punch_time <= TO_TIMESTAMP(SPLIT_PART($1, ',', 1) || ' ' || SPLIT_PART(time_data.refTime, ' to ', 2), 'DD/MM/YYYY HH12:MI AM') + INTERVAL '30 minutes'
                AND emp_code NOT LIKE '%S%'
        )
    )
) AS count
FROM (
    SELECT 
        (refTimeData->>'refTimeId')::INTEGER AS refTimeId,
        refTimeData->>'refTime' AS refTime,
        (refTimeData->>'usercount')::INTEGER AS usercount
    FROM JSONB_ARRAY_ELEMENTS($2::JSONB) AS refTimeData
) AS time_data;

`;

// -----------  ATTENDANCE REWORK ----------------------------------

export const getUserData = `SELECT
  u."refStId",
  u."refSCustId",
  u."refStFName",
  u."refStLName",
  uc."refCtMobile",
  uc."refCtEmail",
  rp."refPackageName",
  pt."refTime"
FROM
  public.users u
  INNER JOIN public."refUserCommunication" uc ON CAST (u."refStId" AS INTEGER) = uc."refStId"
  LEFT JOIN public."refPackage" rp ON CAST (u."refSessionMode" AS INTEGER ) = rp."refPaId"
  LEFT JOIN public."refPaTiming" pt ON CAST (u."refSPreferTimeId" AS INTEGER ) = pt."refTimeId"
WHERE
  u."refStId" = $1`;

export const packageOptions = `SELECT
  rp."refPaId" AS "optionId",
  rp."refPackageName" AS "optionName"
FROM
  public."refPackage" rp
LEFT JOIN
  public."refSessionDays" rsd
ON
  rsd."refSDId" = ANY(string_to_array(REPLACE(REPLACE(rp."refSessionDays", '{', ''), '}', ''), ',')::INTEGER[])
WHERE
  rsd."refDays" IN (
    'All Days',
    CASE
      WHEN TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'), 'FMDay') IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')
        THEN 'Weekdays'
      WHEN TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'), 'FMDay') IN ('Saturday', 'Sunday')
        THEN 'Weekend'
    END,
    TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'), 'FMDay')
  )
  AND
  rp."refBranchId" = $3
AND
  rp."refSessionMode" IN ('Offline & Online', $1)
  AND (
    rp."refDeleteAt" IS NULL
    OR rp."refDeleteAt" = 0
  )
GROUP BY
  rp."refPaId", rp."refPackageName";`;

export const packageOptionsMonth = `SELECT
  "refPaId" AS "optionId",
  "refPackageName" AS "optionName"
FROM
  public."refPackage"
WHERE
  "refBranchId" = $1
  AND (
    "refDeleteAt" is null
    OR "refDeleteAt" = 0
  );`;

export const timingOptions = `SELECT
  "refTimeId" AS "optionId",
  "refTime" AS "optionName"
FROM
  public."refPaTiming"
WHERE
  "refDeleteAt" is null
  OR "refDeleteAt" = 0;`;

export const packageListData = `SELECT
    u."refStId", u."refSCustId", u."refStFName", u."refStLName",
    rp."refPaId",
    rp."refPackageName"
FROM
    public."refPackage" rp
LEFT JOIN public.users u
    ON CAST(u."refSessionMode" AS INTEGER) = rp."refPaId"
WHERE
    rp."refSessionMode" IN ('Offline & Online', $1)
    AND (rp."refDeleteAt" IS NULL OR rp."refDeleteAt" = 0)
    AND rp."refPaId" = ANY($2::INTEGER[])
GROUP BY
    rp."refPaId", rp."refPackageName", u."refStId", u."refSCustId", u."refStFName", u."refStLName";
    
`;

// export const mapUserData = `
// SELECT
//     pt.*,
//     input_data.emp_code,
//     input_data.punch_timestamp AS punch_time,
//     u."refSCustId",
//     u."refStFName",
//     u."refStLName"
// FROM
//     public."refPaTiming" pt
// JOIN (
//     SELECT
//         SPLIT_PART(data, ',', 1) AS emp_code,
//         TO_TIMESTAMP(SPLIT_PART(data, ',', 2), 'DD/MM/YYYY, HH:MI:SS AM') AS punch_timestamp
//     FROM
//         unnest($1::text[]) AS data  -- Ensure input is passed as an array of text
// ) input_data
// ON
//     input_data.punch_timestamp::TIME BETWEEN
//         (TO_TIMESTAMP(SPLIT_PART(pt."refTime", ' to ', 1), 'HH:MI AM')::TIME - INTERVAL '30 minutes')
//         AND
//         (TO_TIMESTAMP(SPLIT_PART(pt."refTime", ' to ', 1), 'HH:MI AM')::TIME + INTERVAL '30 minutes')
// JOIN
//     public."users" u
// ON
//     u."refSCustId" = input_data.emp_code
// WHERE
//     pt."refTimeId" IN (2, 3, 4);

// `;
export const mapUserData = `
WITH raw_data AS (
    SELECT unnest($1::text[]) AS combined_data
),
user_data AS (
    SELECT
        split_part(rd.combined_data, ',', 1) AS user_id,
        split_part(rd.combined_data, ',', 2) AS date,
        split_part(rd.combined_data, ',', 3) AS time
    FROM raw_data rd
),
parsed_ref_time AS (
    SELECT
        "refTimeId",
        "refTime",
        split_part("refTime", ' to ', 1) AS start_time -- Extract start time
    FROM public."refPaTiming"
    WHERE "refTimeId" = ANY($2::int[]) -- Filter by refTimeId passed in the array
),
adjusted_times AS (
    SELECT
        ud.user_id,
        ud.date,
        ud.time,
        u."refSCustId",
        u."refStFName",
        u."refStLName",
        prt."refTimeId",
        prt."refTime",
        TO_TIMESTAMP(TRIM(ud.time), 'HH12:MI:SS AM') AS user_timestamp,
        TO_TIMESTAMP(TRIM(prt.start_time), 'HH12:MI AM') AS ref_timestamp
    FROM user_data ud
    LEFT JOIN users u
        ON TRIM(ud.user_id) = TRIM(u."refSCustId")
    LEFT JOIN parsed_ref_time prt
        ON TRUE
)
SELECT
    at.user_id,
    at.date,
    at.time,
    at."refSCustId",
    at."refStFName",
    at."refStLName",
    at."refTimeId",
    at."refTime"
FROM adjusted_times at
WHERE
    at.ref_timestamp BETWEEN at.user_timestamp - INTERVAL '30 minutes'
                          AND at.user_timestamp + INTERVAL '30 minutes';


`;

export const getAttendanceDatas = `WITH
  filtered_data AS (
    SELECT
      emp_code,
      punch_time,
      LAG(punch_time) OVER (
        PARTITION BY
          emp_code
        ORDER BY
          punch_time
      ) AS prev_punch_time
    FROM
      public.iclock_transaction
    WHERE
      punch_time::date >= TO_TIMESTAMP(
        $1,
        'DD/MM/YYYY'
      )
      AND punch_time::date <= TO_TIMESTAMP(
        $2,
        'DD/MM/YYYY'
      )
      AND emp_code = ANY($3::text[])
  )
SELECT
  emp_code,
  json_agg(TO_CHAR(punch_time, 'DD/MM/YYYY, HH:MI:SS PM')) AS attendance
FROM
  filtered_data
WHERE
  prev_punch_time IS NULL
  OR EXTRACT(
    EPOCH
    FROM
      punch_time - prev_punch_time
  ) > 1200
GROUP BY
  emp_code;
`;

export const getAttendanceDataTiming = `SELECT
  emp_code,
  TO_CHAR(punch_time, 'DD/MM/YYYY, HH:MI:SS AM') AS punch_time
FROM (
  SELECT
    emp_code,
    punch_time,
    LAG(punch_time) OVER (PARTITION BY emp_code, DATE(punch_time) ORDER BY punch_time) AS prev_punch_time
  FROM
    public.iclock_transaction
  WHERE
    DATE(punch_time) BETWEEN TO_DATE($1, 'DD/MM/YYYY') AND TO_DATE($2, 'DD/MM/YYYY')
    AND emp_code NOT LIKE '%S%'
) subquery
WHERE
  prev_punch_time IS NULL OR EXTRACT(EPOCH FROM (punch_time - prev_punch_time)) > 1200;
`;

//  Attendance OverView ----------------------------------------------------------------------

export const getTodayPackageList = `SELECT DISTINCT ON (pt."refTimeId")
pt."refTimeId",
  pt."refTime"
FROM
  public."refPackage" rp
  INNER JOIN public."refSessionDays" sd ON sd."refSDId" = ANY (rp."refSessionDays"::INTEGER[])
  INNER JOIN public."refPaTiming" pt ON pt."refTimeId" = ANY (rp."refTimingId"::INTEGER[])
WHERE
  COALESCE(rp."refDeleteAt", 0) = 0
  AND sd."refDays" IN (
    'All Days',
    TRIM(
      TO_CHAR(
        TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM'),
        'Day'
      )
    ),
    CASE
      WHEN EXTRACT(
        DOW
        FROM TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM')
      ) BETWEEN 1 AND 5 THEN 'Weekdays'
      WHEN EXTRACT(
        DOW
        FROM TO_TIMESTAMP($1, 'DD/MM/YYYY, HH12:MI:SS AM')
      ) IN (0, 6) THEN 'Weekend'
      ELSE NULL
    END
  )
  GROUP BY
  pt."refTimeId",
  pt."refTime";`;

export const getUserCount = `
  SELECT
    pt."refTimeId",
    pt."refTime",
    COUNT(u.*) AS userCount
  FROM
    public."refPaTiming" pt
    LEFT JOIN public.users u ON u."refTimingId" = pt."refTimeId"
  WHERE
    pt."refTimeId" = ANY ($1::INTEGER[])
  GROUP BY
    pt."refTimeId", pt."refTime";
`;

export const getPackageList = `SELECT
  rp."refPaId",
  rp."refPackageName",
  COUNT(u.*) AS usercount,
  ARRAY_AGG(u."refSCustId") AS staff_ids
FROM
  public."refPackage" rp
  INNER JOIN public."refSessionDays" sd ON sd."refSDId" = ANY (rp."refSessionDays"::INTEGER[])
  INNER JOIN public.users u ON CAST(u."refSessionType" AS INTEGER) = rp."refPaId"
WHERE
rp."refBranchId" = $1
AND
u."refSCustId" NOT LIKE '%S%'
AND
	rp."refSessionMode" IN ('Offline & Online',$2)
	AND
  sd."refDays" IN (
    'All Days',
    TRIM(
      TO_CHAR(
        TO_TIMESTAMP($3, 'DD/MM/YYYY, HH12:MI:SS AM'),
        'Day'
      )
    ),
    CASE
      WHEN EXTRACT(
        DOW
        FROM
          TO_TIMESTAMP($3, 'DD/MM/YYYY, HH12:MI:SS AM')
      ) BETWEEN 1 AND 5 THEN 'Weekdays'
      WHEN EXTRACT(
        DOW
        FROM
          TO_TIMESTAMP($3, 'DD/MM/YYYY, HH12:MI:SS AM')
      ) IN (0, 6) THEN 'Weekend'
      ELSE NULL
    END
  )
GROUP BY
  rp."refPaId", rp."refPackageName";`;

export const petUserAttendCount = `WITH register_data AS (
  SELECT
    (package->>'refPaId')::INT AS refPaId,  -- Explicitly extract refPaId
    package  -- Keep the full package for later use
  FROM
    jsonb_array_elements($2::jsonb) AS package
),
staff_list AS (
  SELECT
    s.refPaId,
    UNNEST(
      ARRAY(
        SELECT jsonb_array_elements_text(s.package->'staff_ids')
      )
    ) AS staff_id -- Extract all staff_ids with the associated refPaId
  FROM
    register_data s
),
filtered_transactions AS (
  SELECT
    *,
    LAG(punch_time) OVER (PARTITION BY emp_code ORDER BY punch_time) AS prev_punch_time
  FROM
    public.iclock_transaction
  WHERE
    emp_code NOT LIKE '%S%'
    AND punch_time::date = TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS AM')::date
),
matching_transactions AS (
  SELECT
    s.refPaId,
    COUNT(DISTINCT t.emp_code) AS match_count
  FROM
    filtered_transactions t
  JOIN
    staff_list s ON t.emp_code = s.staff_id
  WHERE
    (t.prev_punch_time IS NULL OR EXTRACT(EPOCH FROM (t.punch_time - t.prev_punch_time)) >= 600)
  GROUP BY
    s.refPaId
)
SELECT
  r.refPaId,
  r.package->>'refPackageName' AS refPackageName,
  r.package->>'usercount' AS usercount,
  COALESCE(m.match_count, 0) AS match_count -- Handle cases with no matches
FROM
  register_data r
LEFT JOIN
  matching_transactions m ON r.refPaId = m.refPaId;

`;
