import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { readFileSync, writeFileSync, existsSync } from 'fs'

  class AnvilReporter implements Reporter {
    private results: string[] = [];

    onTestEnd(test: TestCase, result: TestResult) {
        const now = new Date()
        const date = now.toDateString()
        const time = now.toLocaleTimeString()
        const duration = new Date(result.duration).toISOString().slice(11,19)
        var icon: string = ':question:'
        if (result.status == 'passed') {
            icon = ':green_circle:'
        }
        else if (result.status == 'failed' ) {
            icon = ':red_circle:'
        }
        else if (result.status == 'timedOut') {
            icon = ':alarm_clock:'
        }
        const line: string = `| ${date} | ${time} | ${test.title} | ${duration} | ${result.status} | ${icon} |`
        console.log(line)
        this.results.push(line);
    }

    onEnd() {
        if (this.results.length === 0) return;

        let content = '';
        if (existsSync('Results.md')) {
            content = readFileSync('Results.md', 'utf8');
        } else {
            // Create new file with header
            content = '# Galaxy acceptance test results\n\n';
            content += 'The most current result is at the top of the table.\n\n';
            content += '| Data | Time | Test | Duration | Status | Icon |\n';
            content += '|------|------|------|----------|--------|------|\n';
        }

        // Find insertion point (after the header separator line)
        const headerEnd = content.indexOf('|------|');
        if (headerEnd === -1) {
            console.error('Could not find table header in Results.md');
            return;
        }
        const insertPoint = content.indexOf('\n', headerEnd) + 1;

        // Insert new results at top of table (maintains execution order)
        const newContent =
            content.slice(0, insertPoint) +
            this.results.join('\n') + '\n' +
            content.slice(insertPoint);

        writeFileSync('Results.md', newContent);
    }

}

  export default AnvilReporter;