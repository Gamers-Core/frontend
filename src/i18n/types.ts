import { _Translator } from 'next-intl';

import en from '../../messages/en.json';
import ar from '../../messages/ar.json';

export type EnMessages = typeof en;
export type ArMessages = typeof ar;

export type EnKeys = keyof typeof en;
export type ArKeys = keyof typeof ar;

export type I18nKey = EnKeys | ArKeys;

export type TranslationFn = _Translator<EnMessages | ArMessages>;
