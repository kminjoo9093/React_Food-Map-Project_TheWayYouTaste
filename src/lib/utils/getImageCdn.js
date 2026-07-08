const CDN_BASE = process.env.REACT_APP_IMAGE_CDN_CLOUDINARY;
const SITE_URL = process.env.REACT_APP_SITE_URL;

export function getImageCdn(path, options = "f_auto, q_auto"){
  if(!CDN_BASE || !SITE_URL) return path;

  return `${CDN_BASE}/${options}/${SITE_URL}/${path}`;
}