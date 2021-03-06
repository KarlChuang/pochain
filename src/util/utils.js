import sha256 from 'js-sha256';

const FormatNumberLength = (num, length) => {
  let r = num.toString();
  while (r.length < length) {
    r = `0${r}`;
  }
  return r;
};

export const toLocalDateString = (timestamp) => {
  const date = new Date(timestamp);
  const timestr = `${date.getFullYear()}-${FormatNumberLength(date.getMonth() + 1, 2)}-${FormatNumberLength(date.getDate(), 2)}`;
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
