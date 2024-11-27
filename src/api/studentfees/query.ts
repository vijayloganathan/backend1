export const getFeesStructure = `SELECT
  *
FROM
  (
    SELECT
      u."refStId",
      u."refSCustId",
      u."refStFName",
      u."refStLName",
      uc."refCtMobile",
      uc."refCtEmail",
      uc."refCtWhatsapp",
      ml."refTimeMembers",
      ct."refCustTimeData",
      pt."refTime",
      pt."refTimeMode",
      pt."refTimeDays",
      rp."refPaymentFrom",
      rp."refPaymentTo",
      rp."refExpiry",
      rp."refFeesPaid",
      rp."refGstPaid",
      rp."refOfferType",
      rp."refOfferValue",
      rp."refToAmt",
      rp."refFeesAmtOf",
      rp."refDate",
      rp."refPaymentMode",
      ROW_NUMBER() OVER (
        PARTITION BY
          u."refStId"
        ORDER BY
          rp."refPaId" DESC
      ) AS row_num
    FROM
      public.users u
      INNER JOIN public."refPayment" rp ON CAST(u."refStId" AS INTEGER) = rp."refStId"
      INNER JOIN public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
      LEFT JOIN public."refMembers" ml ON CAST(u."refSessionType" AS INTEGER) = ml."refTimeMembersID"
      LEFT JOIN public."refCustTime" ct ON CAST(u."refSessionMode" AS INTEGER) = ct."refCustTimeId"
      LEFT JOIN public."refTiming" pt ON CAST(u."refSPreferTimeId" AS INTEGER) = pt."refTimeId"
    WHERE
      u."refUtId" = $1
  ) subquery
WHERE
  row_num = 1;`;
