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
import { TimeUnits } from './timeunits';
import { Galaxy } from './galaxy';

test.describe('paste/upload data to a running Galaxy instance', () => {
  const TEST_DATA: string = 'This is a test.'
  let terra: Terra;

  test.beforeEach(async ({ page }) => {
    terra = new Terra(page);
    await terra.login()
  })

  test('Paste text into the upload dialog', async ({}, testInfo) => {
    test.setTimeout(TimeUnits.MIN_15)
    const page = await terra.openGalaxy()
    const galaxy = new Galaxy(page)

    // Create a new history for this test
    await galaxy.newHistory('Paste test - ' + new Date().toLocaleString())

    // Upload data by pasting text into the upload dialog.
    await galaxy.upload([TEST_DATA])
    await page.getByRole('button', { name: '1 : Pasted Entry Display Edit attributes Delete' }).click();

    // Wait for the upload to complete, click the eyeball, and check for the expected text.
    await page.getByRole('button', { name: '1 : Pasted Entry Display Edit attributes Delete Add Tags Add Tags 1 line format txt, database ? uploaded txt file      This is a test.' }).getByTitle('Display').click();
    await expect(page.frameLocator('iframe[name="frame"]').getByText('This is a test.')).toHaveCount(1)

    // Save a screenshot
    const screenshot = await page.screenshot({ path: 'paste.png' })
    testInfo.attach('screenshot', {body: screenshot, contentType: 'image/png'})

    // Delete the history
    await galaxy.deleteHistory()
    await expect(page.getByText('This history is empty.')).toHaveCount(1)
  });

});
