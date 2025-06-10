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
import {TimeUnits} from "../modules/timeunits";
import {otp} from "../modules/topt";

test.describe('see if we can login to Terra', () => {
    // test('ensure we can connect to Terra', async ({page, context}) => {
    //     test.setTimeout(TimeUnits.MIN_5)
    //     // const terra = new Terra(page);
    //     // await terra.login(Terra.sarscov2);
    //     // terra.anything()
    //     // await page.waitForTimeout(TimeUnits.SEC_5);
    //     // await expect(page.getByText('About the workspace')).toHaveCount(1)
    //     console.log('ok')
    // });
    test('try logging in without the Terra object', async ({page, context}) => {
        let url = 'https://anvil.terra.bio/#workspaces/notebooks-canary-project/SARS-CoV-2-Genome%20copy'
        console.log(`Logging in to ${url}`)
        await page.goto(url);
        await page.getByRole('button', { name: 'Agree' }).click();
        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('button', { name: 'Sign In' }).click();
        const page1 = await page1Promise;
        await page1.getByRole('button', { name: 'Sign in with Google' }).click();
        console.log('Signing in')
        await page1.waitForTimeout(TimeUnits.SEC_2)
        const link = page1.getByRole('link', { name: process.env.TERRA_EMAIL!, exact: false })
        if (await link.isVisible()) {
            console.log('Found the Ron Weasley link')
            await link.click()
            await page1.getByLabel('Enter your password').fill(process.env.TERRA_PASSWORD!);
            await page1.click("#passwordNext")
        }
        else if (await page1.getByLabel('Email or phone').isVisible()) {
            console.log('Found login form')
            await page1.getByLabel('Email or phone').fill(process.env.TERRA_EMAIL!);
            await page1.click("#identifierNext")
            await page1.getByLabel('Enter your password').fill(process.env.TERRA_PASSWORD!);
            await page1.click("#passwordNext")
            await page1.getByLabel("Enter code").fill(otp())
            await page1.getByRole("button", {name: "Next"}).click()
            // await page1.getByLabel("Continue").click()
            // await this.page.getByRole('button', { name: 'Agree' }).click();
        }
        else {
            console.log("Login not required")
        }
        console.log("Logged in")

    })
});
