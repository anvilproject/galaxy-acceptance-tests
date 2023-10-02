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
import { Terra } from '../modules/terra';
import { Galaxy } from '../modules/galaxy';
import { VariantCalling as VC } from '../modules/data';
// const datasets: string = 'https://benchmarking-inputs.s3.amazonaws.com/ERR3485802/ERR3485802.forward.fastq.gz\nhttps://benchmarking-inputs.s3.amazonaws.com/ERR3485802/ERR3485802.reverse.fastq.gz\nhttps://benchmarking-inputs.s3.amazonaws.com/ERR3485802/GenBank+genome.genbank'

/*  !!! WARNING !!!
 *
 * This test is not complete.
 * 
 * 1. The workflow that is imported uses tool versions not available on AnVIL
 * 2. Some key steps are missing:
 *    - Creating the paired list collection is missing a click() to select multiple datasets.
 *    - Waiting for the workflow to complete has not been implemented.
 */  
test.describe('[WIP] run a variant calling workflow', () => {

  test('run a variant calling workflow', async ({ page }, testInfo) => {
    const galaxy = await new Galaxy().setup(page)

    // Create a new history
    await galaxy.newHistory('Variant - ' + new Date().toLocaleString())

    // Upload the datasets
    await galaxy.upload(VC.all)

    // Create the list of dataset pairs
    await page.locator('span').filter({ hasText: '1 : ERR3485802.forward.fastq.gz' }).getByRole('button').click();
    await page.locator('span').filter({ hasText: '2 : ERR3485802.reverse.fastq.gz' }).getByRole('button').click();
    await page.getByRole('button', { name: '2 of 3 selected' }).click();
    await page.getByRole('menuitem', { name: 'Build List of Dataset Pairs' }).click();
    await page.getByPlaceholder('Filter text').first().fill('for');
    await page.getByPlaceholder('Filter text').nth(1).fill('rev');
    await page.getByPlaceholder('Filter text').nth(1).click();
    await page.getByText('Pair these datasets', { exact: true }).click();
    await page.getByPlaceholder('Enter a name for your new collection').click();
    await page.getByPlaceholder('Enter a name for your new collection').fill('Paired List');
    await page.getByRole('button', { name: 'Create collection' }).click();
    galaxy.screenshot(testInfo, 'vc-data.png')

    // Import the workflow
    await page.getByRole('link', { name: 'Workflow', exact: true }).click();
    await page.getByRole('button', { name: 'Import' }).click();
    await page.getByLabel('Workflow Import URL').click();
    await page.getByLabel('Workflow Import URL').fill(VC.workflow);
    await page.getByRole('button', { name: 'Import workflow' }).click();
    await page.getByRole('link', { name: 'Generic variation analysis on WGS PE data (imported from URL)' }).click();
    await page.getByRole('button', { name: '' }).click();
    await page.getByRole('button', { name: 'Run Workflow' }).click();

    // TODO - determine the selector we should be waiting on here.
    galaxy.screenshot(testInfo, 'vc-workflow.png')
  })
});
