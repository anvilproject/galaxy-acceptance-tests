import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync } from 'fs'
  
  class AnvilReporter implements Reporter {
  
    onTestEnd(test: TestCase, result: TestResult) {
        const now = new Date()
        const date = now.toDateString()
        const time = now.toLocaleTimeString()
        const duration = new Date(result.duration).toISOString().slice(11,19)
        var icon: string = ':question:'
        if (result.status == 'passed') {
            icon = ':green_circle'
        }
        else if (result.status == 'failed' ) {
            icon = ':red_circle:'
        }
        else if (result.status == 'timedOut') {
            icon = ':alarm_clock:'
        }
        const line: string = `| ${date} | ${time} | ${test.title} | ${duration} | ${result.status} | ${icon} |`
        console.log(line)
        writeFileSync(`Results.md`, line + '\n', { flag: 'a+'})
    }
  
}
  
  export default AnvilReporter;