/**
 * Test fixtures for sentence splitting validation
 */

export interface TestCase {
  name: string;
  input: string;
  expected: string[];
  mode?: 'strict' | 'balanced' | 'loose';
  domain?: string;
}

export const SENTENCE_SPLITTING_TESTS: TestCase[] = [
  {
    name: 'Basic sentences',
    input: 'This is a sentence. This is another sentence. Here is a third one.',
    expected: [
      'This is a sentence.',
      'This is another sentence.',
      'Here is a third one.',
    ],
  },
  {
    name: 'Abbreviations - Dr.',
    input: 'Dr. Smith went to the store. He bought milk.',
    expected: ['Dr. Smith went to the store.', 'He bought milk.'],
  },
  {
    name: 'Abbreviations - e.g. and etc.',
    input: 'There are many fruits, e.g. apples, oranges, etc. They are all fresh.',
    expected: [
      'There are many fruits, e.g. apples, oranges, etc.',
      'They are all fresh.',
    ],
  },
  {
    name: 'Initials',
    input: 'John A. Smith was born in the U.S.A. He lived there.',
    expected: ['John A. Smith was born in the U.S.A.', 'He lived there.'],
  },
  {
    name: 'Decimals',
    input: 'The price is $3.14 per item. That is reasonable.',
    expected: ['The price is $3.14 per item.', 'That is reasonable.'],
  },
  {
    name: 'Questions and exclamations',
    input: 'What is your name? My name is Bob! Nice to meet you.',
    expected: ['What is your name?', 'My name is Bob!', 'Nice to meet you.'],
  },
  {
    name: 'Mixed punctuation',
    input: 'Really?! Yes, really. That is amazing!',
    expected: ['Really?!', 'Yes, really.', 'That is amazing!'],
  },
  {
    name: 'Quotes at end',
    input: 'He said "hello." She replied "goodbye." They left.',
    expected: ['He said "hello."', 'She replied "goodbye."', 'They left.'],
  },
  {
    name: 'Ellipsis',
    input: 'I was thinking... Maybe we should go. What do you think?',
    expected: ['I was thinking...', 'Maybe we should go.', 'What do you think?'],
  },
  {
    name: 'Lowercase after period (dialogue)',
    input: 'She whispered, "hello." then ran away.',
    expected: ['She whispered, "hello."', 'then ran away.'],
  },
  {
    name: 'Months',
    input: 'The meeting is in Jan. 2026. Please attend.',
    expected: ['The meeting is in Jan. 2026.', 'Please attend.'],
  },
  {
    name: 'Company suffixes',
    input: 'Apple Inc. released a new product. Microsoft Corp. did too.',
    expected: ['Apple Inc. released a new product.', 'Microsoft Corp. did too.'],
  },
  {
    name: 'Academic abbreviations',
    input: 'According to Smith et al. the results are clear. See Fig. 3 for details.',
    expected: [
      'According to Smith et al. the results are clear.',
      'See Fig. 3 for details.',
    ],
    domain: 'academic',
  },
  {
    name: 'Empty and whitespace',
    input: '   ',
    expected: [],
  },
  {
    name: 'Single sentence no period',
    input: 'This is a sentence',
    expected: ['This is a sentence'],
  },
  {
    name: 'Multiple spaces',
    input: 'First  sentence.    Second   sentence.',
    expected: ['First sentence.', 'Second sentence.'],
  },
];

export const PARAGRAPH_TEST_CASES: TestCase[] = [
  {
    name: 'Multiple paragraphs',
    input: `This is the first paragraph. It has two sentences.

This is the second paragraph. It also has two sentences.`,
    expected: [
      'This is the first paragraph.',
      'It has two sentences.',
      'This is the second paragraph.',
      'It also has two sentences.',
    ],
  },
  {
    name: 'Mixed paragraph breaks',
    input: `First paragraph.

Second paragraph with Dr. Smith.

Third paragraph.`,
    expected: [
      'First paragraph.',
      'Second paragraph with Dr. Smith.',
      'Third paragraph.',
    ],
  },
];

export const PERFORMANCE_TEST_TEXT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
`.repeat(100); // 300 sentences repeated 100 times = 30,000 sentences
