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
        await context.tracing.start({screenshots: true, snapshots: true})

        const galaxy = await new Galaxy().setup(page)

        // Create a new history and upload the datasets.
        await galaxy.newHistory('Fastp ' + new Date().toLocaleString())
        await galaxy.upload(VariantCalling.pair)

        // Search for the fastp tool
        // await galaxy.page.getByRole('link', { name: 'Tools', exact: true }).click()
        // await galaxy.page.getByPlaceholder('search tools').fill('fastp')
        // await galaxy.page.getByRole('link', {name: 'fastp - fast all-in-one preprocessing for FASTQ files'}).click();
        //
        // // Configure the tool to use the uploaded datasets
        // await galaxy.page.getByText('Single-end').nth(1).click();
        // await galaxy.page.getByRole('option', {name: 'Paired', exact: true}).click()
        // await galaxy.page.locator('#center')
        //     .getByRole('link', {name: '2: ERR3485802.reverse.fastq.gz'})
        //     .first()
        //     .click();
        // await galaxy.page.getByRole('option', {name: '1: ERR3485802.forward.fastq.gz'}).click();
        //
        // // Any of the "Run Tool" buttons will suffice.
        // console.log('Running the fastp tool')
        // await galaxy.page.getByRole('button', {name: 'Run Tool'}).first().click();

        await galaxy.page.getByRole('link', { name: 'Tools', exact: true }).click();
        // await galaxy.page.getByRole('textbox', { name: 'search tools' }).click();
        // await galaxy.page.getByRole('textbox', { name: 'search tools' }).fill('fastp');
        const searchBox = galaxy.page.getByRole('textbox', {name: 'search tools'})
        if (searchBox.isHidden()) {
            await galaxy.page.getByRole('link', {name: 'Tools', exact: true }).click()
        }
        await searchBox.fill('fastp')
        await galaxy.page.getByRole('link', { name: 'fastp fast all-in-one', exact: false }).click();
        await galaxy.page.getByText('Single-end').nth(1).click();
        await galaxy.page.getByRole('option', { name: 'Paired', exact: true }).locator('div').click();
        await galaxy.page.getByText(': ERR3485802.reverse.fastq.gz').first().click();
        await galaxy.page.locator('[id="single_paired\\|in1"]').getByText(': ERR3485802.forward.fastq.gz').click();
        await galaxy.page.getByText(': ERR3485802.reverse.fastq.gz').nth(1).click();
        await galaxy.page.locator('[id="single_paired\\|in2"]').getByText(': ERR3485802.reverse.fastq.gz').click();
        await galaxy.page.getByRole('button', { name: 'Run Tool' }).nth(1).click();

        // Wait for the tool to complete.
        // await galaxy.page.getByRole('button', {name: 'fastp on data 2 and data 1: HTML report Display Edit attributes Delete', exact: false }).click();
        await galaxy.waitForJobs()
        await galaxy.page.getByRole('button', {name: 'fastp on data 2 and data 1: HTML report', exact: false }).click();

        // Save a screenshot
        await galaxy.screenshot(testInfo, 'fastp.png')

        // Delete the history when done.
        // await galaxy.deleteHistory()

        await context.tracing.stop({path: 'fastp-trace.zip'})
        await testInfo.attach('trace', {path: 'fastp-trace.zip'})

        // We should always end up back at the default, empty, history.
        // await expect(galaxy.page.getByText('This history is empty.')).toHaveCount(1)

        console.log('Tool complete')
    })
});
