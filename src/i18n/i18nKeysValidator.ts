/* eslint-disable @typescript-eslint/no-unused-vars */

import { ArKeys, EnKeys } from './types';

type EnDiff = Exclude<EnKeys, ArKeys>;
type ArDiff = Exclude<ArKeys, EnKeys>;

type AssertNever<T extends never> = T;

type _AssertEnDiff = AssertNever<EnDiff>;
type _AssertArDiff = AssertNever<ArDiff>;
