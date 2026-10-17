/**
 * Privacy hard rule for 港 fintech 求职包 V1
 *
 * - Never bake real resume PII, interviewer names, employer brands (e.g. HSBC/汇丰),
 *   Notion URLs, or exact private package numbers into seed / shared UI / PR text.
 * - Demo uses 目标外资银行A/B/C · 面试官X · Tina（示例）.
 * - Illustrative salary bands must be labeled 「示例」.
 */

export const PRIVACY_BANNER =
  '示例数据已脱敏：雇主用「目标外资银行A/B/C」，面试官用「面试官X」。勿把真实姓名、Notion 链接或私密薪酬包写进可分享草稿；本地草稿仅存本机。';

export const PLACEHOLDER_CANDIDATE = 'Tina（示例）';
export const PLACEHOLDER_INTERVIEWER = '面试官X';
export const PLACEHOLDER_BANK_A = '目标外资银行A';
export const PLACEHOLDER_BANK_B = '目标外资银行B';
export const PLACEHOLDER_BANK_C = '目标外资银行C';
export const PLACEHOLDER_CURRENT_EMPLOYER = '香港某外资银行（示例）';
