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
import { Page, expect } from '@playwright/test';

/**
 * A class to perform common tasks in Galaxy.
 */
export class Galaxy {
    
    constructor(public readonly page: Page) {}

    /**
     * Create a new history.
     * 
     * @param name - the name of the new history to create. If not defined one will be generated
     *               based on the local date and time.
     */
    async newHistory(name: string | undefined) {
        if (typeof name === 'undefined') {
            name = 'Test history - ' + new Date().toLocaleString()
        }
        await this.page.getByRole('button', { name: 'Create new history' }).click()
        await this.page.locator('#right')
            .getByRole('button', { name: 'Edit'})
            .first()
            .click()
        await this.page.getByPlaceholder('Name').click()
        await this.page.getByPlaceholder('Name').fill(name);
        await this.page.getByRole('button', {name:'save'}).click()
        await this.page.getByRole('button', {name: 'Switch to history'}).click()
        await this.page.getByRole('cell', {name: new RegExp(name)}).click()    
    }

    /**
     * Deletes the current history.
     */
    async deleteHistory() {
        await this.page.getByRole('button', { name: 'History Options' }).click();
        await this.page.getByRole('menuitem', { name: 'Delete this History' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();      
    }

    /**
     * Upload data by pasting text or URLs
     * 
     * @param items - a list of string
     */
    async upload(items: string[]) {
        await this.page.getByLabel('Download from URL or upload files from disk').click();
        await this.page.getByRole('button', { name: ' Paste/Fetch data' }).click();
        await this.page.getByLabel('Regular').locator('textarea').click();
        await this.page.getByLabel('Regular').locator('textarea').fill(items.join('\n'));
        await this.page.getByRole('button', { name: 'Start' }).click();
        await this.page.getByRole('button', { name: 'Close' }).click();
    }
}