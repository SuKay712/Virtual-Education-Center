import { TranslateOptions } from 'nestjs-i18n';

export interface CustomTranslateOptions extends TranslateOptions {
  cartId?: number;
}
