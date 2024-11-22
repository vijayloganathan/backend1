export const getSectionPageData = `SELECT 
rt."refTimeId",
rt."refTime",
rt."refTimeMode",
rt."refTimeMembersID",
rt."refTimeDays",
rm."refTimeMembers",
rb."refBranchName"
FROM public."refTiming" rt
LEFT JOIN public."refMembers" rm
ON CAST (rt."refTimeMembersID" AS INTEGER) = rm."refTimeMembersID"
LEFT JOIN public.branch rb
ON CAST (rt."refbranchId" AS INTEGER) = rb."refbranchId"
WHERE rt."refbranchId"=$1
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
