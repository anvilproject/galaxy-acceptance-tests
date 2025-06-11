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

// require('dotenv').config({path: __dirname + '/.env.local'})

test.describe('launch a new Galaxy instance', () => {
    let terra: Terra;

    test.beforeEach(async ({page, context}) => {
        terra = new Terra(page);
        await terra.login();
    })

    test('Launch a Galaxy instance', async ({page, context}, testInfo) => {
        // Give Leo lots of time to launch the cluster and install Galaxy
        let timeout: number = TimeUnits.MIN_20
        test.setTimeout(timeout)
        context.tracing.start({snapshots:true, screenshots: true})
        terra.launch();
        const ok = page.getByRole('link', {name: 'Open Galaxy'}).waitFor().then(() => 'ok')
        const error = page.getByLabel('GALAXY EnvironmentError').waitFor().then(() => 'error')
        const result = await Promise.race([ok, error])
        const screenshot = await page.screenshot({path: 'launch.png'})
        testInfo.attach('screenshot', {body: screenshot, contentType: 'image/png'})
        context.tracing.stop({ path: 'launch-trace.zip' })
        expect(result).toEqual('ok')
    });
});

