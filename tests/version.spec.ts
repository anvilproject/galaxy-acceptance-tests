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
import { test, expect } from '@playwright/test';
import { Galaxy } from '../modules/galaxy';

test.describe('Ensure we are running the correct version of Galaxy', () => {
    const EXPECTED_VERSION: string = '23.1'

    test('check the Galaxy version', async ({ page }, testInfo) => {
        const galaxy = await new Galaxy().setup(page)
        let version = EXPECTED_VERSION
        if ('TERRA_VERSION' in process.env) {
            version = process.env.TERRA_VERSION!
        }
        await galaxy.page.getByRole('button', { name: 'Help' }).click();
        await galaxy.page.getByRole('menuitem', { name: 'About' }).click();
        await galaxy.screenshot(testInfo, 'version.png')
        await expect(galaxy.page.getByText(`The Galaxy Server is running version ${version}`)).toHaveCount(1)
    })
})
