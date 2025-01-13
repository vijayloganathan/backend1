export const checkUser = `SELECT
  tv."refStId",tv."refStartTime",tv."refEndTime",u."refStFName",u."refStLName",uc."refCtMobile",uc."refCtEmail"
FROM
  public."refTrailVideo" tv
  LEFT JOIN public.users u ON CAST(tv."refStId" AS INTEGER) = u."refStId"
  LEFT JOIN public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
WHERE
  tv."refStId" = $1`;

export const newEntry = `INSERT INTO "public"."refTrailVideo" ("refStId", "refStartTime", "refEndTime")
VALUES
  ($1, TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM'), 'DD/MM/YYYY, HH12:MI:SS AM'),
       TO_CHAR(TO_TIMESTAMP($2, 'DD/MM/YYYY, HH12:MI:SS AM') + INTERVAL '2 hours', 'DD/MM/YYYY, HH12:MI:SS AM'))
RETURNING *;
`;
