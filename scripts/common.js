import { fetchPlaceholders, getMetadata } from './aem.js';
import Category from './category.js';
import Tag from './tag.js';

const proxy = {
  queryList: '',
  list: '',
};

export const loadedAssets = [];

export async function getQueryList() {
  if (proxy.queryList) {
    return proxy.queryList;
  }
  const resp = await fetch('/query-index.json');
  const jsonData = await resp.json();
  const { data } = jsonData;
  proxy.queryList = data;
  return proxy.queryList;
}
export async function getList() {
  if (proxy.list) {
    return proxy.list;
  }
  const data = await getQueryList();
  const list = [];
  data.forEach((eachData, index) => {
    const rawTags = eachData.tag ? eachData.tag.trim().split(',') : [];
    rawTags.forEach((eachRawTag) => {
      const category = eachRawTag.split('/')[0].split(':')[1];
      const tag = eachRawTag.split('/')[1];
      const tagObj = new Tag(tag);
      const categoryObj = new Category(category, tagObj, eachData.path, index);
      const isCategoryExit = list.filter((listData) => listData.category === categoryObj.category);
      if (isCategoryExit.length) {
        const currentCategory = isCategoryExit[0];
        // currentCategory.count = currentCategory.position ?  : index;
        if (currentCategory.position !== index) currentCategory.count += 1;
        const currentTags = currentCategory.tags;
        const isTagExit = currentTags.filter((tagData) => tagData.tag === tagObj.tag);
        if (!isTagExit.length) currentCategory.tags.push(tagObj);
      } else {
        list.push(categoryObj);
      }
      // if (list[category]) list[category].push(tag);
      // else list[category] = [tag];
    });
  });
  // console.log(list);
  proxy.list = list;
  return proxy.list;
}

async function buildBreadcrumbsFromNavTree() {
  const crumbs = [];

  // const homeUrl = document.querySelector('.nav-brand a[href]').href;
  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname;
  const queryList = await getQueryList();
  const breadcrumbsList = queryList.filter((eachlist) => currentPath.includes(eachlist.path));
  const placeholders = await fetchPlaceholders();
  const homePlaceholder = placeholders.breadcrumbsHomeLabel || 'Home';
  breadcrumbsList.sort((a, b) => a.path.split('/').length - b.path.split('/').length).forEach((link) => {
    if (link.path === '/') {
      crumbs.push({ title: homePlaceholder, url: link.path });
    } else {
      crumbs.push({ title: link.breadcrumbstitle, url: link.path });
    }
  });

  return crumbs;
}

async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  const crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);

  const ol = document.createElement('ol');
  ol.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ol);
  return breadcrumbs;
}

export async function autoBlockBreadcrumb() {
  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    const section = document.querySelector('main .section');
    if (section && !section.dataset.breadcrumbsStatus) {
      section.dataset.breadcrumbsStatus = 'initialized';
      const block = await buildBreadcrumbs();
      section.prepend(block);
    }
  }
}
