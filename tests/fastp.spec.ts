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
import {VariantCalling} from '../modules/data';

test.describe('Run the fastp tool on a small dataset', () => {

    test('run the fastp tool', async ({page, context}, testInfo) => {
        test.setTimeout(TimeUnits.MIN_5)
        const galaxy = await new Galaxy().setup(page)

        // Create a new history and upload the datasets.
        await galaxy.newHistory('Fastp ' + new Date().toLocaleString())
        await galaxy.upload(VariantCalling.pair)

        // Find the fastp tool
        await galaxy.page.getByRole('link', { name: 'Tools', exact: true }).click();
        const searchBox = galaxy.page.getByRole('textbox', {name: 'search tools'})
        if (searchBox.isHidden()) {
            await galaxy.page.getByRole('link', {name: 'Tools', exact: true }).click()
        }
        await searchBox.fill('fastp')
        // Select the tool and fill out the run form
        await galaxy.page.getByRole('link', { name: 'fastp fast all-in-one', exact: false }).click();
        await galaxy.page.getByText('Single-end').nth(1).click();
        await galaxy.page.getByRole('option', { name: 'Single-end', exact: true }).locator('div').click();
        await galaxy.page.getByText(': ERR3485802.reverse.fastq.gz').first().click();
        await galaxy.page.getByRole('button', { name: 'Run Tool' }).nth(1).click();

        // Wait for the tool to complete.
        await galaxy.waitForJobs()

        // Save a screenshot
        await galaxy.page.getByRole('button', {name: 'fastp on data 2: HTML report', exact: false }).click();
        await galaxy.screenshot(testInfo, 'fastp.png')

        console.log('Tool complete')
    })
});
