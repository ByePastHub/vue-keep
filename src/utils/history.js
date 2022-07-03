export function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) return pathname;
  return pathname.slice(base.length) || '/';
}

export function createCurrentLocation(base) {
  const { pathname, search, hash } = location;
  // 允许像 #、/#、#/、#!、#!/、/#!/ 甚至 /folder#end 这样的哈希基数
  const hashPos = base.indexOf('#');
  if (hashPos > -1) {
    const slicePos = hash.includes(base.slice(hashPos))
      ? base.slice(hashPos).length
      : 1;
    let pathFromHash = hash.slice(slicePos);
    // 将起始斜杠添加到哈希之前，因此 url 以 /# 开头
    if (pathFromHash[0] !== '/') { pathFromHash = '/' + pathFromHash; }
    return stripBase(pathFromHash, '');
  }
  const path = stripBase(pathname, base);
  return (path + search + hash).replace(/^\/#/, '');
}

export function getAbsolutePath() {
  const { protocol, host, href } = window.location;
  const protocolAndPath = protocol + '//' + host;
  return href.replace(protocolAndPath, '');
}

export function getBase(router) {
  let base;
  // vue-router3.x版本
  if (router.mode) {
    base = router.options.base;
    return base;
  }
  base = router.options.history?.base;
  if (!base && location.hash) {
    base = location.pathname;
  }

  return base || '/';
}

export function toLocationResolve(router, to) {
  let toLocation = router.resolve(to);
  if (toLocation.resolved) {
    toLocation = toLocation.resolved;
  }

  return toLocation;
}

export function getToLocation(router) {
  const base = getBase(router);
  const path = createCurrentLocation(base);
  const toLocation = toLocationResolve(router, path);

  return toLocation;
}

export function decode(text) {
  try {
    return decodeURIComponent('' + text);
  } catch (err) {
    console.warn(`Error decoding "${text}". Using original value`);
  }
  return '' + text;
}

export function parseQuery(search) {
  const query = {};
  // 避免创建具有空键和空值的对象
  // 因为 split('&')
  if (search === '' || search === '?') return query;
  const hasLeadingIM = search[0] === '?';
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(/\+/g, ' ');
    // 允许 = 字符
    const eqPos = searchParam.indexOf('=');
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));

    if (key in query) {
      let currentValue = query[key];
      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
