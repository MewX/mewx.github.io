import { chromium } from 'playwright';

const DEFAULT_TARGET_URLS = [
  'https://www.mewx.org/blog/202608/google-nest-wifi-h2d-pppoe-mesh-troubleshooting/',
  'https://www.mewx.org/blog/201807/xposed-in-practice/'
];

const targetUrls = process.env.TEST_URLS
  ? process.env.TEST_URLS.split(',').map(s => s.trim())
  : DEFAULT_TARGET_URLS;

async function testPageComments(page, url) {
  console.log(`\n[E2E] Testing URL: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // 1. Ensure container exists
  const disqus = page.locator('#disqus_thread');
  await disqus.waitFor({ state: 'attached', timeout: 20000 });
  console.log('  ✓ Found #disqus_thread container');

  // 2. Wait for the main comments iframe
  const commentsIframe = page.locator('#disqus_thread iframe[src*="disqus.com/embed/comments"]');
  await commentsIframe.waitFor({ state: 'visible', timeout: 20000 });
  console.log('  ✓ Comments iframe is attached and visible');

  // 3. Verify comments iframe expanded
  const box = await commentsIframe.boundingBox();
  if (!box || box.height < 100) {
    throw new Error(`Comments iframe height too small: ${box?.height}px`);
  }
  console.log(`  ✓ Comments iframe height is expanded (${box.height}px)`);

  // 4. Verify no ad iframes remain
  const adIframes = await page.locator('#disqus_thread iframe[src*="ads-iframe"], #disqus_thread iframe[src*="disqusads"], #disqus_thread iframe[src*="taboola"]').count();
  if (adIframes > 0) {
    throw new Error(`Detected ${adIframes} unpruned ad iframe(s) in #disqus_thread`);
  }
  console.log('  ✓ No intrusive ad iframes present');
}

async function main() {
  console.log('=== Starting Disqus E2E Test Suite ===');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  let hasError = false;
  for (const url of targetUrls) {
    try {
      await testPageComments(page, url);
    } catch (err) {
      console.error(`  ✗ Test failed for ${url}:`, err.message);
      hasError = true;
    }
  }

  await browser.close();
  if (hasError) {
    console.error('\n❌ Disqus E2E Test Suite Failed');
    process.exit(1);
  } else {
    console.log('\n✅ All Disqus E2E tests passed successfully');
  }
}

main().catch(err => {
  console.error('Fatal error in test runner:', err);
  process.exit(1);
});
