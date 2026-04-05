/* eslint-disable @typescript-eslint/no-unused-vars */

import en from '../../messages/en.json';
import ar from '../../messages/ar.json';

type TranslateEn = keyof typeof en;
type TranslateAr = keyof typeof ar;

type EnDiff = Exclude<TranslateEn, TranslateAr>;
type ArDiff = Exclude<TranslateAr, TranslateEn>;

type AssertNever<T extends never> = T;

type _AssertEnDiff = AssertNever<EnDiff>;
type _AssertArDiff = AssertNever<ArDiff>;
