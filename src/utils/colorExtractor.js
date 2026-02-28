export function extractColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 40;
      c.height = 40;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 40, 40);
      const d = ctx.getImageData(0, 0, 40, 40).data;

      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 20) {
        r += d[i]; g += d[i+1]; b += d[i+2]; n++;
      }
      r = Math.round(r / n);
      g = Math.round(g / n);
      b = Math.round(b / n);

      const brightness = Math.max(r, g, b);
      const cap = 50;
      if (brightness > cap) {
        const f = cap / brightness;
        r = Math.round(r * f);
        g = Math.round(g * f);
        b = Math.round(b * f);
      }

      resolve(`${r}, ${g}, ${b}`);
    };
    img.onerror = () => resolve('0, 0, 0');
    img.src = imageUrl;
  });
}
