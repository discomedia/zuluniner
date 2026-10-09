import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BlogMarkdown from '../components/BlogMarkdown';

test('contents links match headings with inline formatting and punctuation', () => {
  const html = renderToStaticMarkup(createElement(BlogMarkdown, {
    content: '[Read the records](#read-the-records-before-you-travel)\n\n## Read the **records** before you travel?\n\n## Read the records before you travel!',
  }));
  assert.ok(html.includes('href="#read-the-records-before-you-travel"'));
  assert.ok(html.includes('<h2 id="read-the-records-before-you-travel">'));
  assert.ok(html.includes('<h2 id="read-the-records-before-you-travel-1">'));
  const next = renderToStaticMarkup(createElement(BlogMarkdown, { content: '## Read the records before you travel' }));
  assert.ok(next.includes('<h2 id="read-the-records-before-you-travel">'));
});

test('Markdown tables retain native table markup inside a scrolling container', () => {
  const html = renderToStaticMarkup(createElement(BlogMarkdown, {
    content: '| Document | Question |\n| --- | --- |\n| Logbook | What happened? |',
  }));
  assert.ok(html.includes('<div class="max-w-full overflow-x-auto"><table>'));
  assert.ok(html.includes('<th>Document</th>'));
  assert.ok(html.includes('<td>What happened?</td>'));
  assert.ok(!html.includes('<script'));
});
