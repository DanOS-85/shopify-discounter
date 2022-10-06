/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from './generated/locale-codes.js';
import * as templates_es_419 from './generated/locales/es-419.js';
const localizedTemplates = new Map([
    ['es-419', templates_es_419]
]);
export const { getLocale, setLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: (locale) => Promise.resolve(localizedTemplates.get(locale)),
});
export const setLocaleFromUrl = async () => {
    const url = new URL(window.location.href);
    const locale = url.searchParams.get('locale') || sourceLocale;
    console.log('%cSETTING', 'color: orange; background: black; padding: 5px;', locale);
    await setLocale(locale);
};
//# sourceMappingURL=localization.js.map