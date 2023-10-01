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

require('dotenv').config({path: __dirname + '/.env.local'})

test.describe('create a new history and change its name', () => {

    test('history', async ({page}, testInfo) => {
        const galaxy = await new Galaxy().setup(page)

        const historyName = 'Test history ' + new Date().toLocaleString()
        await galaxy.newHistory(historyName)
        await expect(galaxy.page.getByRole('heading', {name: historyName})).toHaveCount(1)
        await galaxy.screenshot(testInfo, 'history.png')
        await galaxy.deleteHistory()

        // We should always end up back at the default, empty, history.
        await expect(galaxy.page.getByText('This history is empty.')).toHaveCount(1)
    });
});

