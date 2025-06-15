// getAssets.ts

export const getBgVideo = (filename: string) => {
  return new URL(
    `/bg-videos/${filename}`,
    import.meta.env.VITE_CDN_DOMAIN
  ).toString();
};
