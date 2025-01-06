const setQueryParam = (key, value) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  params.set(key, value);
  if (!value) {
    params.delete(key);
  }
  url.search = params.toString();
  window.history.pushState({}, "", url);
};

export default setQueryParam;
