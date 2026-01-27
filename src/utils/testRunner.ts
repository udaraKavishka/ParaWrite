/**
 * Test runner for sentence splitting validation
 */

import { splitIntoSentences } from './textProcessing';
import { SENTENCE_SPLITTING_TESTS, PARAGRAPH_TEST_CASES, PERFORMANCE_TEST_TEXT } from './testFixtures';
import { SplitterConfig } from './splitterConfig';

export interface TestResult {
  name: string;
  passed: boolean;
  expected: string[];
  actual: string[];
  error?: string;
}

export interface PerformanceResult {
  sentenceCount: number;
  duration: number;
  sentencesPerSecond: number;
}

/**
 * Run a single test case
 */
function runTestCase(testCase: typeof SENTENCE_SPLITTING_TESTS[0]): TestResult {
  try {
    const config: SplitterConfig = {
      mode: testCase.mode || 'balanced',
      domain: testCase.domain,
    };
    
    const actual = splitIntoSentences(testCase.input, config);
    const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
    
    return {
      name: testCase.name,
      passed,
      expected: testCase.expected,
      actual,
    };
  } catch (error) {
    return {
      name: testCase.name,
      passed: false,
      expected: testCase.expected,
      actual: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run all sentence splitting tests
 */
export function runAllTests(): {
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  };
} {
  const allTests = [...SENTENCE_SPLITTING_TESTS, ...PARAGRAPH_TEST_CASES];
  const results = allTests.map(runTestCase);
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  return {
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      passRate: (passed / results.length) * 100,
    },
  };
}

/**
 * Run performance benchmark
 */
export function runPerformanceBenchmark(
  text: string = PERFORMANCE_TEST_TEXT,
  config?: SplitterConfig
): PerformanceResult {
  const startTime = performance.now();
  const sentences = splitIntoSentences(text, config);
  const endTime = performance.now();
  
  const duration = endTime - startTime;
  const sentencesPerSecond = (sentences.length / duration) * 1000;
  
  return {
    sentenceCount: sentences.length,
    duration,
    sentencesPerSecond,
  };
}

/**
 * Print test results to console
 */
export function printTestResults(): void {
  console.log('🧪 Running Sentence Splitting Tests...\n');
  
  const { results, summary } = runAllTests();
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    
    if (!result.passed) {
      console.log('  Expected:', result.expected);
      console.log('  Actual:  ', result.actual);
      if (result.error) {
        console.log('  Error:   ', result.error);
      }
      console.log('');
    }
  });
  
  console.log('\n📊 Test Summary:');
  console.log(`  Total:  ${summary.total}`);
  console.log(`  Passed: ${summary.passed} ✅`);
  console.log(`  Failed: ${summary.failed} ❌`);
  console.log(`  Pass Rate: ${summary.passRate.toFixed(1)}%`);
  
  // Performance benchmark
  console.log('\n⚡ Performance Benchmark:');
  const perfResult = runPerformanceBenchmark();
  console.log(`  Sentences: ${perfResult.sentenceCount.toLocaleString()}`);
  console.log(`  Duration: ${perfResult.duration.toFixed(2)}ms`);
  console.log(`  Speed: ${perfResult.sentencesPerSecond.toFixed(0)} sentences/sec`);
}

/**
 * Validate that splitting is deterministic
 */
export function testDeterminism(text: string, iterations = 10): boolean {
  const firstResult = JSON.stringify(splitIntoSentences(text));
  
  for (let i = 1; i < iterations; i++) {
    const result = JSON.stringify(splitIntoSentences(text));
    if (result !== firstResult) {
      return false;
    }
  }
  
  return true;
}
