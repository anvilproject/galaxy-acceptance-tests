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
        let insertPoint = content.indexOf('\n', headerEnd) + 1;

        // Check if there's already data in the table from today's run
        // If so, append to it instead of inserting at the very top
        const lines = content.split('\n');
        const headerLineIndex = lines.findIndex(line => line.startsWith('|------|'));

        if (headerLineIndex !== -1 && lines.length > headerLineIndex + 1) {
            // Get the first data row (if it exists)
            const firstDataRow = lines[headerLineIndex + 1];
            if (firstDataRow && firstDataRow.trim().length > 0) {
                // Extract date from first existing row
                const firstRowDate = firstDataRow.split('|')[1]?.trim();
                // Extract date from new result
                const newResultDate = this.results[0].split('|')[1]?.trim();

                // If dates match, we're in the same run - append after the last matching date
                if (firstRowDate === newResultDate) {
                    // Find where the current run ends (first row with different date or end of data)
                    let lastMatchingIndex = headerLineIndex + 1;
                    for (let i = headerLineIndex + 1; i < lines.length; i++) {
                        const rowDate = lines[i].split('|')[1]?.trim();
                        if (rowDate === newResultDate) {
                            lastMatchingIndex = i;
                        } else if (rowDate && rowDate !== newResultDate) {
                            break;
                        }
                    }
                    // Calculate insertion point after the last matching row
                    insertPoint = lines.slice(0, lastMatchingIndex + 1).join('\n').length + 1;
                }
            }
        }

        // Insert new results at the calculated position
        const newContent =
            content.slice(0, insertPoint) +
            this.results.join('\n') + '\n' +
            content.slice(insertPoint);

        writeFileSync('Results.md', newContent);
    }

}

  export default AnvilReporter;