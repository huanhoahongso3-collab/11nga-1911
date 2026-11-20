const BACKGROUND = '#FFFDF9';

async function waitForImages(node) {
  await Promise.all(
    [...node.querySelectorAll('img')].map((img) => (img.complete && img.naturalWidth ? null : img.decode().catch(() => {}))),
  );
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Renders a DOM node to a PNG and hands it to the user. Resolves 'downloaded', 'shared' or 'cancelled'.
export async function exportNodeToPng(node, filename) {
  const { toBlob } = await import('html-to-image');
  await waitForImages(node);
  if (document.fonts?.ready) await document.fonts.ready;

  // The first render only warms up fonts and images: Safari often draws it blank.
  await toBlob(node, { pixelRatio: 1, backgroundColor: BACKGROUND });
  const blob = await toBlob(node, { pixelRatio: 3, backgroundColor: BACKGROUND });
  if (!blob) throw new Error('export failed');

  const file = new File([blob], filename, { type: 'image/png' });
  if (isIOS() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return 'downloaded';
}
