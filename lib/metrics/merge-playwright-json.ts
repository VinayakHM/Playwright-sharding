import * as fs from 'fs';
import * as path from 'path';

interface Stats {
  expected: number;
  skipped: number;
  unexpected: number;
  flaky: number;
  duration: number;
}

interface PlaywrightResults {
  suites?: any[];
  errors?: any[];
  stats: Stats;
}

const [, , inputDir, fileName, outputFile] = process.argv;

const merged: PlaywrightResults = {
  suites: [],
  errors: [],
  stats: { expected: 0, skipped: 0, unexpected: 0, flaky: 0, duration: 0 }
};

const durations: number[] = [];

fs.readdirSync(inputDir).forEach(dir => {
  const filePath = path.join(inputDir, dir, fileName);
  if (fs.existsSync(filePath)) {
    const data: PlaywrightResults = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.suites) merged.suites!.push(...data.suites);
    if (data.errors) merged.errors!.push(...data.errors);
    if (data.stats) {
      merged.stats.expected += data.stats.expected || 0;
      merged.stats.skipped += data.stats.skipped || 0;
      merged.stats.unexpected += data.stats.unexpected || 0;
      merged.stats.flaky += data.stats.flaky || 0;
      durations.push(data.stats.duration || 0);
    }
  }
});

// Set duration to the maximum across all shards
merged.stats.duration = Math.max(...durations);

fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
