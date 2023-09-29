import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync } from 'fs'
  
  class AnvilReporter implements Reporter {
  
    onTestEnd(test: TestCase, result: TestResult) {
        const now = new Date()
        const date = now.toDateString()
        const time = now.toLocaleTimeString()
        const duration = new Date(result.duration).toISOString().slice(11,19)
        const line: string = `| ${date} | ${time} | ${test.title} | ${duration} | ${result.status} |`
        console.log(line)
        writeFileSync(`Results.md`, line + '\n', { flag: 'a+'})
    }
  
}
  
  export default AnvilReporter;