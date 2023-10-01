/**
 *  Copyright 2023 The Galaxy Project (https://galaxyproject.org)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import {test, expect} from '@playwright/test';
import {Galaxy} from '../modules/galaxy';
import {TimeUnits} from '../modules/timeunits';

test.describe('connect to an already running Galaxy instance', () => {
    test('Open Galaxy in a new tab', async ({page}) => {
        test.setTimeout(TimeUnits.MIN_5)
        const galaxy = await new Galaxy().setup(page)
        await expect(galaxy.page).toHaveURL(/proxy\/google\/v1\/apps\/terra/)
    });
});

