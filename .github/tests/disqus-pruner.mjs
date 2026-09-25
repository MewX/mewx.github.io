import fs from 'node:fs';
import path from 'node:path';

/**
 * Disqus Ad Pruner, Validator & Post Discovery utilities.
 */

/**
 * Discovers published blog post URLs with comments enabled by inspecting Markdown front matter.
 *
 * @param {string} postsDir - Path to _posts directory
 * @param {string} baseUrl - Base site URL (default: https://www.mewx.org)
 * @returns {Array<{ file: string, url: string, title: string }>}
 */
export function getPostUrls(postsDir, baseUrl = 'https://www.mewx.org') {
  if (!fs.existsSync(postsDir)) return [];
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  const results = [];
  for (const file of files) {
    const fullPath = path.join(postsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Skip posts that are explicitly unpublished or have comments disabled
    if (/^published:\s*false/m.test(content)) continue;
    if (/^comments:\s*false/m.test(content)) continue;

    const match = file.match(/^(\d{4})-(\d{2})-\d{2}-(.+)\.md$/);
    if (match) {
      const year = match[1];
      const month = match[2];
      const slug = match[3];
      const url = `${normalizedBase}/blog/${year}${month}/${slug}/`;

      const titleMatch = content.match(/^title:\s*["']?(.*?)["']?$/m);
      const title = titleMatch ? titleMatch[1] : slug;

      results.push({ file, url, title });
    }
  }
  return results;
}

/**
 * Prunes ad iframes from a Disqus container without removing
 * the main comments iframe or notification indicators.
 *
 * @param {HTMLElement} container - The container element (e.g., #disqus_thread)
 * @returns {Array<HTMLElement>} List of removed iframes
 */
export function pruneDisqusAds(container) {
  if (!container || !container.getElementsByTagName) return [];
  const removed = [];
  const iframes = Array.from(container.getElementsByTagName('iframe'));
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];
    const src = iframe.src || (iframe.getAttribute && iframe.getAttribute('src')) || '';
    if (src.includes('ads-iframe') || src.includes('disqusads') || src.includes('taboola')) {
      if (typeof iframe.remove === 'function') {
        iframe.remove();
      } else if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      removed.push(iframe);
    }
  }
  return removed;
}

/**
 * Validates that a comments iframe is present in the container
 * and hasn't been improperly destroyed or replaced.
 *
 * @param {HTMLElement} container - The container element (e.g., #disqus_thread)
 * @returns {{ valid: boolean, commentsIframe: HTMLElement|null, reason?: string }}
 */
export function validateCommentsState(container) {
  if (!container || !container.getElementsByTagName) {
    return { valid: false, commentsIframe: null, reason: 'Container not found' };
  }
  const iframes = Array.from(container.getElementsByTagName('iframe'));
  const commentsIframe = iframes.find(f => {
    const src = f.src || (f.getAttribute && f.getAttribute('src')) || '';
    const id = f.id || '';
    return src.includes('disqus.com/embed/comments') || (id.startsWith('dsq-app') && !src.includes('ads'));
  });

  if (!commentsIframe) {
    return { valid: false, commentsIframe: null, reason: 'Comments iframe missing' };
  }
  return { valid: true, commentsIframe };
}
