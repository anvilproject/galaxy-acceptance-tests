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

test.describe('delete any lingering persistent disks', () => {
    let terra: Terra;

    test.beforeEach(async ({ page }) => {
      terra = new Terra(page);
    })
  
  test('delete disks from the user\'s cloud environments menu', async ({ page }) => {
    await terra.login()
    await page.getByRole('button', { name: 'Toggle main menu' }).click();
    await page.getByRole('button', { name: 'Google profile image Ron Weasley' }).click();
    await page.getByRole('link', { name: 'Cloud Environments' }).click();
    const delete_button = page.getByRole('table', { name: 'persistent disks' })
        .getByRole('cell', { name: 'integration_test' })
        .locator('xpath=..')
        .getByRole('cell', { name: 'Delete' })
        
    const visible = await delete_button.isVisible()
    if (visible) {
        console.log('Found disks to delete!')
        await delete_button.click()
        await page.getByRole('button', { name: 'OK' }).click()
        await expect(delete_button).toBeHidden({timeout: TimeUnits.MIN_10})
    }
    else {
        console.log('No persistent disks to delete')
    }
    console.log('Done')
 });
});
