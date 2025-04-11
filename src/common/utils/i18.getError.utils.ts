import { I18nContext } from 'nestjs-i18n';
import { ExecutionContext } from '@nestjs/common';

export function getErrorMessage(
  key: string,
  args: any = {},
  context: ExecutionContext
) {
  const request = context.switchToHttp().getRequest(); // Lấy request hiện tại từ ExecutionContext
  const i18n = I18nContext.current(request); // Lấy i18nContext từ request hiện tại
  return i18n.t(key, args); // Trả về thông báo dịch từ i18n
}
