import { div, li, ul } from '../../scripts/dom-helpers.js';
import Category from './category.js';
import Tag from './tag.js';
import decorateAccordion from '../accordion/accordion.js';

export function capitalizeFirstLet(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getList() {
  const resp = await fetch('/query-index.json');
  const jsonData = await resp.json();
  const { data } = jsonData;
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
  return list;
}

export default async function decorate(block) {
  const list = await getList();
  block.firstElementChild.append(
    div(
      ul(
        ...list[0].tags.map((eachData) => li(capitalizeFirstLet(eachData.tag))),
      ),
    ),
  );

  if (window.innerWidth < 769) {
    decorateAccordion(block);
  }
}
