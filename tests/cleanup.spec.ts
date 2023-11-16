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
import {TimeUnits} from '../modules/timeunits';

test.describe('delete any lingering persistent disks', () => {
    test('delete disks from the user\'s cloud environments menu', async ({page}) => {
        test.setTimeout(120000)
        const terra = new Terra(page);
        await terra.login()
        await page.getByRole('button', {name: 'Toggle main menu'}).click();
        await page.getByRole('button', {name: 'Google profile image Ron Weasley'}).click();
        await page.getByRole('link', {name: 'Cloud Environments'}).click();
        var deleting = true
        var count = 0
        while (true) {
            await page.getByRole('table', {name: 'persistent disks'}).getByRole('button', {name: 'Delete'}).nth(1).click({timeout: TimeUnits.SEC_30})
            await page.getByRole('button', {name: 'OK'}).click()
            ++count
            console.log(`Deleted disk ${count}`)
            page.waitForTimeout(TimeUnits.SEC_10)
        }
        // while (deleting) {
        //     console.log("Looking for the delete button")
        //     // const delete_button = page.getByRole('table', {name: 'persistent disks'})
        //     //     .getByRole('cell', {name: 'SARS-CoV-2-Genome copy', exact: false})
        //     //     .locator('xpath=..')
        //     //     .getByRole('cell', {name: 'Delete'})
        //     var delete_button = page.getByRole('table', {name: 'persistent disks'})
        //     if (! await delete_button.isVisible()) {
        //         console.log("No table found")
        //         deleting = false
        //     }
        //     delete_button = page.getByRole('button', {name: 'Delete'})
        //         // .getByRole('cell', {name: 'Delete'})
        //     const visible = await delete_button.isVisible()
        //     if (visible) {
        //         console.log('Found disks to delete!')
        //         await delete_button.click()
        //         await page.getByRole('button', {name: 'OK'}).click()
        //         await expect(delete_button).toBeHidden({timeout: TimeUnits.MIN_10})
        //     } else {
        //         console.log('No persistent disks to delete')
        //         deleting = false
        //     }
        // }
        console.log('Done')
    });
});
