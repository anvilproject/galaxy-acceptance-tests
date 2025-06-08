/**
 *  Copyright 2025 The Galaxy Project (https://galaxyproject.org)
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

test.describe('import data tests', () => {
    test("Export a history to the user's workspace", async ({page}, testInfo) => {
        const TEST_DATA: string = 'This is a test.'

        test.setTimeout(TimeUnits.MIN_2)
        const galaxy = await new Galaxy().setup(page)

        // Create a new history for this test
        const name = 'Export test ' + new Date().toISOString()
        await galaxy.newHistory(name)

        // Upload data by pasting text into the upload dialog.
        await galaxy.upload([TEST_DATA])

        // Start the export
        await galaxy.page.getByRole('button', { name: 'History Options' }).click();
        await galaxy.page.getByRole('menuitem', { name: 'Export History to File' }).click();
        await galaxy.page.getByRole('tab', { name: 'to a remote file' }).click();
        await galaxy.page.getByRole('textbox', { name: 'Click to select directory' }).click();
        await galaxy.page.getByRole('link', { name: 'SARS-CoV-2-Genome copy' }).click();
        await galaxy.page.getByRole('link', { name: 'Other Data/' }).click();
        await galaxy.page.getByRole('link', { name: 'Files/' }).click();
        await galaxy.page.getByRole('button', { name: 'Select this folder' }).click();
        // await page.getByRole('textbox', { name: 'Name' }).click();
        await galaxy.page.getByRole('textbox', { name: 'Name' }).fill(name);
        await galaxy.page.getByRole('button', { name: 'Export' }).click();
        // Wait for the export to complete
        await expect(galaxy.page.getByText('Executing history export job')).toBeVisible();
        await expect(galaxy.page.getByRole('alert')).toContainText('History successfully exported.', {timeout: TimeUnits.MIN_5});
        // Save a screenshot
        await galaxy.screenshot(testInfo, 'export.png')

        // Check that the exported history exists in the workspace.
        await page.getByRole('link', {name: 'Workspace files'}).click()
        // await expect(page.getByLabel('Files in SARS-CoV-2-Genome copy content')).toContainText(name);
        await expect(page.getByRole('link', {name: name})).toBeVisible()
        let screenshot = await page.screenshot({ path: 'export-files.png' })
        testInfo.attach('screenshot-files', { body: screenshot, contentType: 'image/png'})

        await page.getByRole('checkbox', {name: 'Select ' + name}).click()
        await page.getByRole('button', {name: 'Delete'}).click()
        await page.getByRole('button', {name: 'Delete File'}).click()
        await page.waitForTimeout(TimeUnits.SEC_2)
        screenshot = await page.screenshot({path: 'export-clean.png'})
        testInfo.attach('screenshot-clean', {body:screenshot, contentType: 'image/png'})
        console.log('Export complete')
    })
});
