// Takes a url and returns the first magnet link that can be found on the page
export const getMagnetUrl = async (url?: string): Promise<string> => {
  if (!url) return "";

  // fetch the content of 'url' and parse it
  // find the magnet link
  // return the magnet link
  const response = await fetch(url);
  const source = await response.text();

  const magnetLinks = source.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]*/g);

  return magnetLinks ? magnetLinks[0] : "";
};
