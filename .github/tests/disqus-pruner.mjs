import fs from 'node:fs';
import path from 'node:path';

/**
 * Disqus Ad Pruner, Validator & Post Discovery utilities.
 */

/**
 * Extracts the actual MutationObserver callback function directly from _layouts/post-v4.html.
 * This guarantees that unit tests exercise the exact production script deployed to the site,
 * ensuring tests fail if production layout code breaks or regresses.
 *
 * @param {string} [layoutPath] - Optional path to post-v4.html
 * @returns {(container: HTMLElement) => void}
 */
export function getPrunerFromLayout(layoutPath) {
  const resolvedPath = layoutPath || path.resolve(import.meta.dirname, '../../_layouts/post-v4.html');
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Layout file not found at ${resolvedPath}`);
  }
  const content = fs.readFileSync(resolvedPath, 'utf8');
  const match = content.match(/new MutationObserver\((function\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\}\s*)\)/);
  if (!match) {
    throw new Error(`Could not find MutationObserver callback in ${resolvedPath}`);
  }
  return new Function('disqus', `(${match[1]})();`);
}

/**
 * Runs the production pruning logic from _layouts/post-v4.html against a container element.
 *
 * @param {HTMLElement} container - The container element (e.g., #disqus_thread)
 * @param {string} [layoutPath] - Optional custom path to post-v4.html
 */
export function pruneDisqusAds(container, layoutPath) {
  if (!container || !container.getElementsByTagName) return;
  const pruner = getPrunerFromLayout(layoutPath);
  pruner(container);
}

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
