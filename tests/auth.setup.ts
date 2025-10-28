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
import { test as authenticate, expect } from '@playwright/test';
import { Terra } from '../modules/terra';
import { TimeUnits } from '../modules/timeunits';
import {otp} from "../modules/topt";

const authFile = '.auth/user.json';

authenticate('authenticate', async ({ page }) => {
  // Perform authentication steps. 
  await page.goto(Terra.sarscov2)  // + 'integration_tests');
  await page.getByRole('button', {name: 'Agree'}).click()
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Sign In' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Sign in with Google' }).click();
  await page1.waitForTimeout(TimeUnits.SEC_5)
  // if (await page1.getByRole('link', {name: process.env.TERRA_EMAIL!, exact: false}).first().isVisible()) {
  //   await page1.getByRole('link', {name: process.env.TERRA_EMAIL!, exact: false}).first().click()
  // }
  // else {
    await page1.getByLabel('Email or phone').fill(process.env.TERRA_EMAIL!);
    await page1.click("#identifierNext")
  // }
  await page1.getByLabel('Enter your password').fill(process.env.TERRA_PASSWORD!);  
  await page1.click("#passwordNext")
  await page1.getByLabel("Enter code").fill(otp())
  await page1.getByRole("button", {name: "Next"}).click()

  // Wait until the popup closes - this ensures all cookies are received
  await page1.waitForEvent('close')

  // Wait for the main page to be fully authenticated
  await expect(page.getByText('ABOUT THE WORKSPACE')).toHaveCount(1, {timeout: TimeUnits.SEC_30})

  // Give it an extra moment to ensure all cookies are set
  await page.waitForTimeout(TimeUnits.SEC_2)

  // Save the context for reuse
  await page.context().storageState({ path: authFile });
});