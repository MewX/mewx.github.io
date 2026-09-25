import path from 'node:path';
import { chromium } from 'playwright';
import { getPostUrls } from './disqus-pruner.mjs';

const CONCURRENCY = parseInt(process.env.CONCURRENCY || '2', 10);
const DELAY_MS = parseInt(process.env.DELAY_MS || '1000', 10);
const postsDir = process.env.POSTS_DIR || path.resolve(import.meta.dirname, '../../_posts');

// Discover all published posts from _posts directory or allow manual override
const allPosts = process.env.TEST_URLS
  ? process.env.TEST_URLS.split(',').map(u => ({ url: u.trim(), title: u.trim(), file: 'manual' }))
  : getPostUrls(postsDir, process.env.BASE_URL || 'https://www.mewx.org');

console.log(`=== Disqus E2E Test Suite ===`);
console.log(`Testing ${allPosts.length} published post pages`);
console.log(`Settings: Concurrency=${CONCURRENCY}, Inter-page delay=${DELAY_MS}ms\n`);

async function testSinglePost(context, item, index, total) {
  const { url, title, file } = item;
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // 1. Wait for Disqus container
    const disqus = page.locator('#disqus_thread');
    await disqus.waitFor({ state: 'attached', timeout: 25000 });

    // 2. Wait for the primary comments iframe
    const commentsIframe = page.locator('#disqus_thread iframe[src*="disqus.com/embed/comments"], #disqus_thread iframe[id^="dsq-app"]:not([src*="ads"])');
    await commentsIframe.waitFor({ state: 'visible', timeout: 25000 });

    // Allow Disqus layout / async resize to settle
    await page.waitForTimeout(500);

    // 3. Verify expanded height
    const box = await commentsIframe.boundingBox();
    if (!box || box.height < 100) {
      throw new Error(`Comments iframe height too small: ${box?.height}px`);
    }

    // 4. Verify no ad iframes remain
    const adIframes = await page.locator(
      '#disqus_thread iframe[src*="ads-iframe"], #disqus_thread iframe[src*="disqusads"], #disqus_thread iframe[src*="taboola"]'
    ).count();
    if (adIframes > 0) {
      throw new Error(`Found ${adIframes} unpruned ad iframe(s)`);
    }

    console.log(`[${index + 1}/${total}] ✓ ${file}: "${title.slice(0, 45)}" (${box.height}px)`);
    return { success: true, url, title };
  } catch (err) {
    console.error(`[${index + 1}/${total}] ✗ ${file}: ${err.message}`);
    return { success: false, url, title, error: err.message };
  } finally {
    await page.close();
  }
}

async function runWorkerPool(context, items) {
  const results = [];
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      const res = await testSinglePost(context, items[idx], idx, items.length);
      results.push(res);

      // Add gentle delay between requests to prevent hotspotting or rate limits
      if (DELAY_MS > 0 && currentIndex < items.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const startTime = Date.now();

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const results = await runWorkerPool(context, allPosts);

  await browser.close();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const failed = results.filter(r => !r.success);

  console.log(`\n========================================`);
  console.log(`Test Results: ${results.length - failed.length}/${results.length} passed in ${duration}s`);
  if (failed.length > 0) {
    console.error(`\nFailed pages (${failed.length}):`);
    for (const f of failed) {
      console.error(` - ${f.url} : ${f.error}`);
    }
    process.exit(1);
  } else {
    console.log(`All ${results.length} post pages verified successfully! 🎉`);
  }
}

main().catch(err => {
  console.error('Fatal error in test runner:', err);
  process.exit(1);
});
