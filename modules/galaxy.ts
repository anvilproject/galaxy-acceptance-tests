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
import { Page, TestInfo, expect } from '@playwright/test';
import { Terra } from './terra'
import {TimeUnits} from "./timeunits";

/**
 * A class to perform common tasks in Galaxy.
 */
export class Galaxy {

    page: Page
    
    async setup(page: Page) {

        if (Terra.isTerraTest()) {
            let terra = new Terra(page)
            await terra.login()
            this.page = await terra.openGalaxy()
        }
        else {
            this.page = page
            // if ( !('TERRA_URL' in process.env) ) {
            //     process.env.TERRA_URL = 'http://35.196.87.134:8000/galaxy/'
            // }
            await this.page.goto(process.env.TERRA_URL!)
        }
        return this
    }

    /**
     * Create a new history.
     * 
     * @param name - the name of the new history to create. If not defined one will be generated
     *               based on the local date and time.
     */
    async old_newHistory(name: string | undefined) {
        if (typeof name === 'undefined') {
            name = 'Test history - ' + new Date().toLocaleString()
        }
        console.log(`Creating history "${name}"`)
        await this.page.getByRole('button', { name: 'Create new history' }).click()
        await this.page.locator('#right')
            .getByRole('button', { name: 'Edit'})
            .first()
            .click()
        await this.page.getByPlaceholder('Name').click()
        await this.page.getByPlaceholder('Name').fill(name);
        await this.page.getByRole('button', {name:'save'}).click()
        // await this.page.getByRole('button', {name: 'Switch to history'}).click()
        // await this.page.getByRole('cell', {name: new RegExp(name)}).click()    
        console.log('History created.')
    }

    async newHistory(name: string | undefined) : Promise<void>  {
        if (typeof name === 'undefined') {
           name = 'Test history - ' + new Date().toLocaleString()
        }
        console.log(`Creating history "${name}"`)
        await this.page.getByRole('navigation', { name: 'current history management' }).getByRole('button').first().click();
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('button', { name: 'Edit' }).click();
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('textbox', { name: 'Name' }).press('ControlOrMeta+a');
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('textbox', { name: 'Name' }).fill(name);
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.waitForTimeout(TimeUnits.SEC_2)
        console.log('History created')
    }
    /**
     * Deletes the current history.
     */
    async deleteHistory() {
        console.log('Deleting the current history')
        await this.page.getByRole('button', { name: 'History Options' }).click();
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('menuitem', { name: 'Delete this History' }).click();
        await this.page.waitForTimeout(TimeUnits.SEC_1)
        await this.page.getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(TimeUnits.SEC_2)
        console.log('History deleted')
    }

    /**
     * Upload data by pasting text or URLs
     * 
     * @param items - a list of string
     */
    async upload(items: string[]) {
        console.log('Uploading data')
        // await this.page.getByLabel('Download from URL or upload files from disk').click();
        await this.page.getByRole('link', { name: 'Upload' }).click()
        await this.page.getByRole('button', { name: 'Paste/Fetch data', exact: false }).click();
        await this.page.getByLabel('Regular').locator('textarea').click();
        await this.page.getByLabel('Regular').locator('textarea').fill(items.join('\n'));
        await this.page.getByRole('button', { name: 'Start' }).click();
        await this.page.getByRole('button', { name: 'Close', exact: true }).click();
        console.log('Upload in progress.')
        await this.waitForJobs()
        // await expect(async () => {
        //     const count = await this.page.getByRole("button", { name: "This job is currently running" }).count();
        //     expect(count).toBeGreaterThan(0);
        // }).toPass();
        // await expect(this.page.getByRole("button", { name: "This job is currently running"})).toHaveCount(0, {timeout: TimeUnits.MIN_10})
        console.log('Upload complete.')
    }

    /**
     * Wait for all currently running jobs to complete
     */
    async waitForJobs() : Promise<void> {
        console.log('Waiting for jobs')
        // Wait for them to be started
        await expect(async () => {
            const count = await this.page.getByRole("button", { name: "This job is currently running" }).count();
            expect(count).toBeGreaterThan(0);
        }).toPass();
        // Then wait for them to finish
        await expect(this.page.getByRole("button", { name: "This job is currently running"})).toHaveCount(0, {timeout: TimeUnits.MIN_10})
        console.log('Jobs complete')
    }
    /** 
     * Take a screenshot of the current state of the UI and attach it to the testInfo
     */
    async screenshot(testInfo: TestInfo, path:string = 'screenshot.png') {
        console.log(`Saving screenshot ${path}`)
        const screenshot = await this.page.screenshot({ path: path })
        testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png'})
    }

    getPage() {
        return this.page
    }
}