import axios from 'axios';

const allowedDomains = ['ridb.recreation.gov', 'developer.nps.gov', 'services.arcgis.com'];

function isSafeURL(url) {
  try {
    const parsed = new URL(url);
    return allowedDomains.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
}

export async function safeGet(url, config = {}) {
  if (!isSafeURL(url)) {
    throw new Error(`Blocked unsafe URL: ${url}`);
  }
  return axios.get(url, config);
}
