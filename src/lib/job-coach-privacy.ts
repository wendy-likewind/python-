/**
 * Privacy hard rule for 港 fintech 求职包 V1
 *
 * - Never bake real resume PII, interviewer names, employer names,
 *   Notion URLs, or salary package numbers into seed data, shared UI
 *   copy, or PR descriptions.
 * - Demo / archive stubs use 公司A · 面试官X · 候选人 placeholders.
 * - User-local notes may contain their own facts in localStorage only;
 *   do not sync those into templates or illustrative seeds.
 */

export const PRIVACY_BANNER =
  '隐私：示意数据已脱敏。勿把真实简历细节、面试官姓名、雇主名、Notion 链接或薪酬包数字写进共享模板；本地草稿仅存本机。';

export const PLACEHOLDER_CANDIDATE = '候选人';
export const PLACEHOLDER_INTERVIEWER = '面试官X';
export const PLACEHOLDER_COMPANY_A = '公司A';
export const PLACEHOLDER_COMPANY_B = '公司B';
export const PLACEHOLDER_COMPANY_C = '公司C';

/** Display helper — never invent a real org from thin labels. */
export function companyLabel(name: string, isIllustrative: boolean): string {
  if (isIllustrative) return name; // already placeholder in seed
  return name;
}
