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

/**
 * A class to provide statically defined constants for common time durations.  There are
 * also static factory methods and mutators to generate arbitrary durations.
 * 
 * For example:
 * 
 * let timeout: number = TimeUnits.hours(2).minutes(30).seconds(43).msec()
 */
export class TimeUnits {
    public static readonly SEC_1: number = 1000
    public static readonly SEC_2: number = this.SEC_1 * 2
    public static readonly SEC_5: number = this.SEC_1 * 5
    public static readonly SEC_10: number = this.SEC_1 * 10
    public static readonly SEC_30: number = this.SEC_1 * 30
    public static readonly MIN_1 = this.SEC_1 * 60
    public static readonly MIN_2 = this.MIN_1 * 2
    public static readonly MIN_5 = this.MIN_1 * 5
    public static readonly MIN_10 = this.MIN_1 * 10
    public static readonly MIN_15 = this.MIN_1 * 15
    public static readonly MIN_20 = this.MIN_1 * 20
    public static readonly MIN_30 = this.MIN_1 * 30

    private _msec: number

    private constructor(t:number) {
        this._msec = t
    }

    static seconds(n:number) : TimeUnits {
        return new TimeUnits(n * 1000)
    }

    static minutes(n:number) : TimeUnits {
        return new TimeUnits(n * 60000)
    }

    static hours(n: number) : TimeUnits {
        return new TimeUnits(n * 3600000)
    }

    seconds(t: number) : TimeUnits {
        this._msec += t * 1000
        return this
    }

    minutes(t:number) : TimeUnits {
        this._msec += t * 60000
        return this
    }

    hours(t:number) : TimeUnits {
        this._msec += t * 3600000
        return this
    }

    msec() : number {
        return this._msec
    }

    sec() : number {
        return this._msec / 1000
    }

    min() : number {
        return this._msec / 60000
    }

}