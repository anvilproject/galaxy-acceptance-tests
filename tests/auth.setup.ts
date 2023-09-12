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
import { Terra } from './terra';

const authFile = '.auth/user.json';

authenticate('authenticate', async ({ page }) => {
  // Perform authentication steps. 
  await page.goto(Terra.test + 'integration_tests');
  await page.getByRole('button', {name: 'Agree'}).click()
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Sign In' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Sign in with Google' }).click();
  await page1.getByLabel('Email or phone').fill(process.env.TERRA_EMAIL!);
  await page1.click("#identifierNext")
  await page1.getByLabel('Enter your password').fill(process.env.TERRA_PASSWORD!);  
  await page1.click("#passwordNext")

  // Wait until the page receives the cookies.
  await page1.waitForEvent('close')

  // Save the context for re-uese.
  await page.context().storageState({ path: authFile });
});