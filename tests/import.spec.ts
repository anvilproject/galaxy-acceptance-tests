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
import { Terra } from './terra';
import { Galaxy } from './galaxy';
import { TimeUnits } from './timeunits';
import { VariantCalling } from './data';

test.describe('import data', () => {
  let terra: Terra;

  test.beforeEach(async ({ page }) => {
    terra = new Terra(page);
  })

  test('import', async ({ }, testInfo) => {
    test.setTimeout(TimeUnits.MIN_10)
    await terra.login()
    const page = await terra.openGalaxy()
    const galaxy = new Galaxy(page)

    // Create a new history and upload the datasets.
    await galaxy.newHistory('Import ' + new Date().toLocaleString())
    await page.getByLabel('Download from URL or upload files from disk').click();
    await page.getByRole('button', { name: ' Choose remote files' }).click();
    await page.getByRole('link', { name: 'SARS-CoV-2-Genome copy' }).click();
    await page.getByRole('link', { name: 'Tables/' }).click();
    await page.getByRole('link', { name: 'reference/' }).click();
    await page.getByRole('row', { name: ' SARS-CoV-2_reference_genome.fasta -' }).locator('svg').click();
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.getByRole('button', { name: ' Choose remote files' }).click();
    await page.getByRole('link', { name: 'SARS-CoV-2-Genome copy' }).click();
    await page.getByRole('link', { name: 'Tables/' }).click();
    await page.getByRole('link', { name: 'sample/' }).click();
    await page.getByRole('row', { name: ' VA_sample_forward_reads.fastq -' }).locator('svg').click();
    await page.getByRole('row', { name: ' VA_sample_reverse_reads.fastq -' }).locator('svg').click();
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: '3 : VA_sample_reverse_reads.fastq Display Edit attributes Delete' }).getByTitle('Display').click();
    await page.getByRole('button', { name: 'History Options' }).click();
    await page.getByRole('menuitem', { name: 'Delete this History' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Save a screenshot
    await galaxy.screenshot(testInfo, 'import.png')

    // Delete the history when done.
    await galaxy.deleteHistory()

    // We should always end up back at the default, empty, history.
    await expect(page.getByText('This history is empty.')).toHaveCount(1)
    
    console.log('Test complete')
  })
});
