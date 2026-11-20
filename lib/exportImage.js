const BACKGROUND = '#FFFDF9';

async function waitForImages(node) {
  await Promise.all(
    [...node.querySelectorAll('img')].map((img) => (img.complete && img.naturalWidth ? null : img.decode().catch(() => {}))),
  );
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Renders a DOM node to a PNG blob. The first render only warms up fonts and images: Safari often draws it blank.
export async function renderPng(node, pixelRatio = 3) {
  const { toBlob } = await import('html-to-image');
  await waitForImages(node);
  if (document.fonts?.ready) await document.fonts.ready;

  await toBlob(node, { pixelRatio: 1, backgroundColor: BACKGROUND });
  const blob = await toBlob(node, { pixelRatio, backgroundColor: BACKGROUND });
  if (!blob) throw new Error('export failed');
  return blob;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// Resolves 'downloaded', 'shared' or 'cancelled'.
export async function exportNodeToPng(node, filename) {
  const blob = await renderPng(node);

  const file = new File([blob], filename, { type: 'image/png' });
  if (isIOS() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }

  downloadBlob(blob, filename);
  return 'downloaded';
}

// Opens the system share sheet (Android share intent / iOS share sheet, where Zalo and Messenger appear) with the
// image and the link. Call it straight from a tap so the browser still counts it as a user gesture.
// Resolves 'shared', 'cancelled', 'copied' (link only) or 'unsupported'.
export async function shareBlob(blob, filename, { title, text, url }) {
  const file = new File([blob], filename, { type: 'image/png' });
  const withFile = { files: [file], title, text: `${text}\n${url}` };

  try {
    if (navigator.canShare?.(withFile)) {
      await navigator.share(withFile);
      return 'shared';
    }
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return 'shared';
    }
  } catch (error) {
    if (error?.name === 'AbortError') return 'cancelled';
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'unsupported';
  }
}
