// export const getBirthdayData = `SELECT *
// FROM public.users u
// JOIN public."refUserCommunication"  uc
// ON CAST (u."refStId" AS INTEGER) = uc."refStId"
// WHERE to_char("refStDOB", 'MM-DD') = to_char(CURRENT_DATE, 'MM-DD');`;
export const getBirthdayData = `SELECT *
FROM public.users u
JOIN public."refUserCommunication" uc
ON CAST(u."refStId" AS INTEGER) = uc."refStId"
WHERE to_char("refStDOB", 'MM-DD') = to_char(to_date('2024-07-30', 'YYYY-MM-DD'), 'MM-DD');`;
