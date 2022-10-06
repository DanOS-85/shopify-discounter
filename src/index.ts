/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

 import {setLocaleFromUrl} from './localization.js';
 import './discounter.js';
 
 (async () => {
   try {
     // Defer first render until our initial locale is ready, to avoid a flash of
     // the wrong locale.
     console.log('%cTEST', 'color: orange; background: black; padding: 5px;');
     await setLocaleFromUrl();
   } catch (e) {
     // Either the URL locale code was invalid, or there was a problem loading
     // the locale module.
     console.error(`Error loading locale: ${(e as Error).message}`);
   }
 })();
 