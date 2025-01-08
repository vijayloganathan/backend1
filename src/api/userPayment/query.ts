export const initialDataOfPayment = `SELECT
  u."refStId",
  u."refSCustId",
  u."refStFName",
  u."refStLName",
  u."refSeTo",
  rp."refPackageName",
  pt."refTime",
  u."refClassMode",
  rp."refFeesType",
  rp."refFees",
  rp."refPaId",
  rm."refTimeMembers"
FROM
  public.users u
  INNER JOIN public."refPackage" rp ON CAST(u."refSessionMode" AS INTEGER) = rp."refPaId"
  INNER JOIN public."refPaTiming" pt ON CAST(u."refTimingId" AS INTEGER) = pt."refTimeId"
  INNER JOIN public."refMembers" rm ON CAST(u."refSessionType" AS INTEGER) = rm."refTimeMembersID"
WHERE
  u."refStId" = 4;;
`;

export const otherPackage = `
SELECT
  rp.*,
  ARRAY_AGG(rm."refTimeMembers") AS refTimeMembersArray
FROM
  public."refPackage" rp
  INNER JOIN public."refMembers" rm ON rm."refTimeMembersID" = ANY (
    string_to_array(
      regexp_replace(rp."refMemberType", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  rp."refPaId" != $1
GROUP BY
  rp."refPaId";`;
