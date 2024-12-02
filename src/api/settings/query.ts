// export const getSectionPageData = `SELECT
// rt."refTimeId",
// rt."refTime",
// rt."refTimeMode",
// rt."refTimeMembersID",
// rt."refTimeDays",
// rm."refTimeMembers",
// rb."refBranchName"
// FROM public."refTiming" rt
// LEFT JOIN public."refMembers" rm
// ON CAST (rt."refTimeMembersID" AS INTEGER) = rm."refTimeMembersID"
// LEFT JOIN public.branch rb
// ON CAST (rt."refbranchId" AS INTEGER) = rb."refbranchId"
// WHERE rt."refbranchId"=$1
// `;
export const getSectionPageData = `SELECT 
  rt."refTimeId",
  rt."refTime",
  rt."refTimeMode",
  rt."refTimeMembersID",
  rt."refTimeDays" AS "refTimeDaysId",
  rm."refTimeMembers",
  rb."refBranchName",
  sd."refDays" AS "refTimeDays"
FROM public."refTiming" rt
LEFT JOIN public."refMembers" rm
  ON CAST(rt."refTimeMembersID" AS INTEGER) = rm."refTimeMembersID"
LEFT JOIN public."branch" rb
  ON CAST(rt."refbranchId" AS INTEGER) = rb."refbranchId"
  INNER JOIN public."refSessionDays" sd
  ON CAST (rt."refTimeDays" AS INTEGER) = sd."refSDId"
WHERE rt."refbranchId" = $1
  AND (rt."refDeleteAt" is null OR rt."refDeleteAt" =0)
`;

export const getBranchData = `SELECT * FROM public.branch`;

export const getMemberList = `SELECT * FROM public."refMembers"`;

export const setNewSection = `insert into
  public."refTiming" (
    "refTime",
    "refTimeMode",
    "refTimeDays",
    "refTimeMembersID",
    "refbranchId"
  )
values
  (
    $1,$2,$3,$4,$5
  )`;

export const getSessionDays = `SELECT * FROM public."refSessionDays"`;

export const updateSection = `UPDATE public."refTiming" rt 
SET "refTime"=$1,"refTimeMode"=$2,"refTimeDays"=$3,"refTimeMembersID"=$4 
WHERE "refTimeId"=$5
RETURNING *;`;

// export const deleteSection = `UPDATE public."refTiming" rt
// SET rt."refDeleteAt"=1
// WHERE "refTimeId"=$1
// RETURNING *;`;
export const deleteSection = `update
  "public"."refTiming"
set
  "refDeleteAt" = 1
where
  "refTimeId" = $1;`;

// export const customClass = `SELECT * FROM public."refCustTime" WHERE "refBranchId"=$1 AND ("refDeleteAt" is null OR "refDeleteAt" =0)`;

export const customClass = `SELECT
  ct.*,
  b."refBranchName"
FROM
  public."refCustTime" ct
  LEFT JOIN public.branch b ON CAST (ct."refBranchId" AS INTEGER) = b."refbranchId"
WHERE
  "refBranchId" = $1
  AND (
    "refDeleteAt" is null
    OR "refDeleteAt" = 0
  )`;
export const addCustomClass = `insert into
  "public"."refCustTime" (
    "refBranchId",
    "refCustTimeData"
    
  )
values
  ($1,$2)
  RETURNING *;`;

export const editCustomClass = `update
  "public"."refCustTime"
set
  "refCustTimeData" = $1
where
  "refCustTimeId" = $2;`;

export const deleteCustomClass = `update
  "public"."refCustTime"
set
  "refDeleteAt" = 1
where
  "refCustTimeId" = $1;`;
