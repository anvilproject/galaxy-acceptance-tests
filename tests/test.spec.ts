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
import { TimeUnits } from './timeunits';
require('dotenv').config({ path: '../tests/.env.local' })

class Greeter {

    constructor(public readonly greeting: string) {}

    greet(name: string) : string {
        return `${this.greeting} ${name}`
    }
}

test('check some args', async () => {
    console.log(process.env.TERRA_EMAIL)
    if ('TERRA_URL' in process.env) {
        console.log(process.env.TERRA_URL)
    }
    else {
        console.log('TERRA_EMAIL not set.')
    }
})

test('time tests', () => {
    console.log(TimeUnits.minutes(1).seconds(60).min())
    console.log(TimeUnits.hours(1).min())
    console.log(TimeUnits.minutes(1).sec())
    console.log(TimeUnits.seconds(1).msec())

})

test('Greeter tests', () => {
    let hello = new Greeter('Hello')
    let goodbye = new Greeter('Goodbye')
    expect(hello.greet('Keith')).toEqual('Hello Keith')
    expect(goodbye.greet('cruel world')).toEqual('Goodbye cruel world')
})

test('Static time tests', () => {
    console.log(TimeUnits.SEC_1)
    console.log(TimeUnits.SEC_30)
    console.log(TimeUnits.MIN_1)
})
