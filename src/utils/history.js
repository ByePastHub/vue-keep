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
  if (router.mode) {
    // vue-router4.x以下版本
    base = router.options.base;
    // if (!base) {
    //   base =
    // }
    return base;
  }
  base = router.options.history?.base || '/';

  return base;
}

export function getToLocation($router) {
  const base = getBase($router);
  const path = createCurrentLocation(base);
  const toLocation = $router.resolve(path);

  return toLocation;
}

export function limitMaxPosition(keepPosition) {
  let maxPosition = keepPosition + 1 >= history.length ? history.length : keepPosition;
  if (maxPosition === history.length) {
    maxPosition = history.length - 1;
  }
  return maxPosition;
}
