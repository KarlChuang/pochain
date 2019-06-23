import sha256 from 'js-sha256';

export const toLocalDateString = (timestamp) => {
  const date = new Date(timestamp);
  const timestr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  // timestr += `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return timestr;
};

export const hashProduct = ({
  name,
  deadline,
  description,
  price,
  producer,
  baseline,
  images,
}) => {
  let hashStr = sha256(name);
  hashStr = `${hashStr}${sha256(toLocalDateString(deadline))}`;
  hashStr = `${hashStr}${sha256(description)}`;
  hashStr = `${hashStr}${sha256(price.toString())}`;
  hashStr = `${hashStr}${sha256(producer)}`;
  hashStr = `${hashStr}${sha256(baseline.toString())}`;
  images.forEach((url) => {
    const hashUrl = url.split(';base64,')[1];
    hashStr = `${hashStr}${sha256(hashUrl)}`;
  });
  const productHash = sha256(hashStr);
  return productHash;
};
