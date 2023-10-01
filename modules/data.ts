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
 * Static definitions for the URLs needed for the variant calling and fastp tests.
 */
export abstract class VariantCalling {
    public static readonly genbank: string = 'https://benchmarking-inputs.s3.amazonaws.com/ERR3485802/GenBank+genome.genbank'
    public static readonly forward: string = 'https://benchmarking-inputs.s3.amazonaws.com/ERR3485802/ERR3485802.forward.fastq.gz'
    public static readonly reverse: string = 'https://benchmarking-inputs.s3.amazonaws.com/ERR3485802/ERR3485802.reverse.fastq.gz'
    public static readonly workflow: string = 'https://raw.githubusercontent.com/galaxyproject/iwc/main/workflows/variant-calling/generic-variant-calling-wgs-pe/Generic-variation-analysis-on-WGS-PE-data.ga'
    
    public static readonly pair: string[] = [ this.forward, this.reverse ]
    public static readonly all: string[] = [ this.forward, this.reverse, this.genbank ]
}