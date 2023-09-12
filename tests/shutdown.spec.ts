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

test.describe('shutdown the instance and delete disks', () => {
    let terra: Terra;

    test.beforeEach(async ({ page }) => {
      terra = new Terra(page);
    })
  
  test('Delete the Galaxy instance', async ({ page }) => {
    await terra.login()
    await terra.shutdown()
    await expect(page.getByLabel('Galaxy Environment')).toHaveCount(0)
  });
});
