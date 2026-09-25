import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pruneDisqusAds, validateCommentsState, getPostUrls } from '../scripts/disqus-pruner.mjs';

function createMockElement(tagName, attributes = {}) {
  const children = [];
  const elem = {
    tagName: tagName.toUpperCase(),
    parentNode: null,
    children,
    ...attributes,
    getAttribute(name) {
      return this[name] || null;
    },
    getElementsByTagName(tag) {
      const match = tag.toUpperCase();
      const results = [];
      function traverse(node) {
        for (const child of node.children) {
          if (child.tagName === match) {
            results.push(child);
          }
          traverse(child);
        }
      }
      traverse(this);
      return results;
    },
    appendChild(child) {
      child.parentNode = this;
      children.push(child);
      return child;
    },
    removeChild(child) {
      const idx = children.indexOf(child);
      if (idx !== -1) {
        children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    },
    remove() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }
  };
  return elem;
}

test('pruneDisqusAds removes ad iframes and preserves comments and indicators', () => {
  const container = createMockElement('div', { id: 'disqus_thread' });

  const commentsFrame = createMockElement('iframe', {
    id: 'dsq-app1234',
    src: 'https://disqus.com/embed/comments/?base=default&f=mewx&t_u=https%3A%2F%2Fwww.mewx.org%2Fpost%2F'
  });
  const indicatorNorth = createMockElement('iframe', {
    id: 'indicator-north',
    src: ''
  });
  const indicatorSouth = createMockElement('iframe', {
    id: 'indicator-south',
    src: ''
  });
  const adFrame1 = createMockElement('iframe', {
    id: 'dsq-app9999',
    src: 'https://disqus.com/ads-iframe/taboola/?foo=bar'
  });
  const adFrame2 = createMockElement('iframe', {
    id: 'dsq-app8888',
    src: 'https://cdn.disqusads.com/ad.html'
  });

  container.appendChild(commentsFrame);
  container.appendChild(indicatorNorth);
  container.appendChild(indicatorSouth);
  container.appendChild(adFrame1);
  container.appendChild(adFrame2);

  assert.equal(container.children.length, 5);

  const removed = pruneDisqusAds(container);

  assert.equal(removed.length, 2);
  assert.equal(container.children.length, 3);
  assert.equal(container.children[0].id, 'dsq-app1234');
  assert.equal(container.children[1].id, 'indicator-north');
  assert.equal(container.children[2].id, 'indicator-south');
});

test('pruneDisqusAds handles clean container without ads without removing anything', () => {
  const container = createMockElement('div', { id: 'disqus_thread' });
  const commentsFrame = createMockElement('iframe', {
    id: 'dsq-app1234',
    src: 'https://disqus.com/embed/comments/?base=default&f=mewx'
  });
  const indicatorNorth = createMockElement('iframe', {
    id: 'indicator-north',
    src: ''
  });

  container.appendChild(commentsFrame);
  container.appendChild(indicatorNorth);

  const removed = pruneDisqusAds(container);

  assert.equal(removed.length, 0);
  assert.equal(container.children.length, 2);
  assert.equal(container.children[0].id, 'dsq-app1234');
});

test('regression: demonstrates bug where index-based selection destroyed comments', () => {
  const container = createMockElement('div', { id: 'disqus_thread' });

  // Order that occurs when Disqus initializes notification indicators
  const commentsFrame = createMockElement('iframe', {
    id: 'dsq-app1234',
    src: 'https://disqus.com/embed/comments/?base=default&f=mewx'
  });
  const indicatorNorth = createMockElement('iframe', {
    id: 'indicator-north',
    src: ''
  });

  container.appendChild(commentsFrame);
  container.appendChild(indicatorNorth);

  // 1. Buggy logic simulation:
  const iframes = container.getElementsByTagName('iframe');
  assert.equal(iframes.length, 2);
  // Old logic assumed iframes[1] was comments
  const wrongCommentsIframe = iframes[1];
  assert.equal(wrongCommentsIframe.id, 'indicator-north', 'Old logic erroneously picked indicator-north as comments');

  // 2. New safe logic:
  pruneDisqusAds(container);
  const state = validateCommentsState(container);
  assert.equal(state.valid, true);
  assert.equal(state.commentsIframe.id, 'dsq-app1234', 'New logic safely retains comments iframe');
});

test('validateCommentsState detects missing or wiped comments iframe', () => {
  const container = createMockElement('div', { id: 'disqus_thread' });

  const indicatorNorth = createMockElement('iframe', {
    id: 'indicator-north',
    src: ''
  });
  container.appendChild(indicatorNorth);

  const state = validateCommentsState(container);
  assert.equal(state.valid, false);
  assert.equal(state.reason, 'Comments iframe missing');
});

test('pruneDisqusAds safely handles null or empty input', () => {
  assert.deepEqual(pruneDisqusAds(null), []);
  assert.deepEqual(pruneDisqusAds({}), []);
  assert.equal(validateCommentsState(null).valid, false);
});

test('getPostUrls discovers published posts and formats URLs correctly', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'posts-test-'));

  try {
    fs.writeFileSync(
      path.join(tempDir, '2026-08-11-nest-wifi.md'),
      '---\ntitle: "Nest Wifi"\ncomments: true\npublished: true\n---\nHello'
    );
    fs.writeFileSync(
      path.join(tempDir, '2018-07-18-xposed.md'),
      '---\ntitle: "Xposed"\ncomments: true\n---\nHello'
    );
    // Should be skipped (published: false)
    fs.writeFileSync(
      path.join(tempDir, '2022-01-22-wip.md'),
      '---\ntitle: "WIP"\ncomments: true\npublished: false\n---\nHello'
    );
    // Should be skipped (comments: false)
    fs.writeFileSync(
      path.join(tempDir, '2020-05-01-no-comments.md'),
      '---\ntitle: "No Comments"\ncomments: false\npublished: true\n---\nHello'
    );

    const posts = getPostUrls(tempDir, 'https://www.mewx.org');
    assert.equal(posts.length, 2);
    assert.deepEqual(posts.map(p => p.url), [
      'https://www.mewx.org/blog/201807/xposed/',
      'https://www.mewx.org/blog/202608/nest-wifi/'
    ]);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('getPostUrls correctly discovers actual workspace repository posts', () => {
  const posts = getPostUrls(path.resolve('_posts'), 'https://www.mewx.org');
  assert.equal(posts.length, 35, 'Should discover all 35 published posts in repository');
  const nestWifi = posts.find(p => p.url.includes('google-nest-wifi-h2d-pppoe-mesh-troubleshooting'));
  assert.ok(nestWifi, 'Should include Google Nest Wifi post');
  assert.equal(nestWifi.url, 'https://www.mewx.org/blog/202608/google-nest-wifi-h2d-pppoe-mesh-troubleshooting/');
});
