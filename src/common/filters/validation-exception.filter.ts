import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import { I18nContext } from 'nestjs-i18n';
import { I18nValidationException } from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current(); // Lấy i18n context

    // Lấy lỗi đã được dịch qua i18n
    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    // Tùy chỉnh để chỉ trả về thông báo lỗi
    const normalizedErrors = this.normalizeValidationErrors(errors);

    const response = host.switchToHttp().getResponse();
    response
      .status(400) // Bạn có thể đặt status code tùy chỉnh
      .json({
        statusCode: 400,
        message: normalizedErrors[0], // Chỉ trả về thông báo lỗi
        error: 'Bad Request',
      });
  }

  // Tùy chỉnh chỉ trả về thông báo lỗi
  protected normalizeValidationErrors(
    validationErrors: ValidationError[]
  ): string[] {
    return iterate(validationErrors)
      .map(error => this.mapChildrenToValidationErrors(error))
      .flatten()
      .filter(item => !!item.constraints)
      .map(item => Object.values(item.constraints)) // Lấy message từ constraints
      .flatten()
      .toArray(); // Trả về mảng các thông báo lỗi
  }

  // Nếu có lỗi lồng nhau, bạn cần xử lý
  protected mapChildrenToValidationErrors(
    error: ValidationError
  ): ValidationError[] {
    if (!error.children || error.children.length === 0) {
      return [error];
    }
    return [
      error,
      ...iterate(error.children)
        .map(child => this.mapChildrenToValidationErrors(child))
        .flatten(),
    ];
  }
}
