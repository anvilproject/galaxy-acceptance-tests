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
import {Terra} from '../modules/terra';
import {Galaxy} from '../modules/galaxy';
import {TimeUnits} from '../modules/timeunits';
import {VariantCalling} from '../modules/data';

test.describe('import data', () => {
//   let terra: Terra;

//   test.beforeEach(async ({ page }) => {
//     terra = new Terra(page);
//   })

    test('Import datasets from the workspace', async ({page}, testInfo) => {
        test.setTimeout(TimeUnits.MIN_10)
        // await terra.login()
        // const page = await terra.openGalaxy()
        const galaxy = await new Galaxy().setup(page)

        // Create a new history and upload the datasets.
        await galaxy.newHistory('Import ' + new Date().toLocaleString())
        await galaxy.page.getByLabel('Download from URL or upload files from disk').click();
        await galaxy.page.getByRole('button', {name: ' Choose remote files'}).click();
        await galaxy.page.getByRole('link', {name: 'SARS-CoV-2-Genome copy'}).click();
        await galaxy.page.getByRole('link', {name: 'Tables/'}).click();
        await galaxy.page.getByRole('link', {name: 'reference/'}).click();
        await galaxy.page.getByRole('row', {name: ' SARS-CoV-2_reference_genome.fasta -'}).locator('svg').click();
        await galaxy.page.getByRole('button', {name: 'Ok'}).click();
        await galaxy.page.getByRole('button', {name: ' Choose remote files'}).click();
        await galaxy.page.getByRole('link', {name: 'SARS-CoV-2-Genome copy'}).click();
        await galaxy.page.getByRole('link', {name: 'Tables/'}).click();
        await galaxy.page.getByRole('link', {name: 'sample/'}).click();
        await galaxy.page.getByRole('row', {name: ' VA_sample_forward_reads.fastq -'}).locator('svg').click();
        await galaxy.page.getByRole('row', {name: ' VA_sample_reverse_reads.fastq -'}).locator('svg').click();

        // Start the upload/import
        await galaxy.page.getByRole('button', {name: 'Ok'}).click();
        await galaxy.page.getByRole('button', {name: 'Start'}).click();
        await galaxy.page.getByRole('button', {name: 'Close'}).click();

        // Wait until the upload completes
        await galaxy.page.getByRole('button', {name: 'VA_sample_reverse_reads.fastq Display Edit attributes Delete', exact: false}).getByTitle('Display').click();

        // Take a screenshot.
        await galaxy.screenshot(testInfo, 'import.png')

        // Delete the history when done.
        await galaxy.deleteHistory()

        // We should always end up back at the default, empty, history.
        await expect(galaxy.page.getByText('This history is empty.')).toHaveCount(1)

        console.log('Test complete')
    })
});
