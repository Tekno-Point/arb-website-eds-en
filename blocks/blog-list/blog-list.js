import { getQueryList } from '../../scripts/common.js';
import {
  a, div, li, ul, img, h5, p,
} from '../../scripts/dom-helpers.js';

// async function getBlogList() {
//   const resp = await fetch('/query-index.json');
//   const jsonData = await resp.json();
//   const { data } = jsonData;
//   const list = [];
//   data.forEach(elem=>{
//     if(elem.tag!==""){
//         l.push(e)
//     }})
//   return list;
// }

export default async function decorate(block) {
  const list = await getQueryList();
  console.log(list);
  const path = new URL(window.location.href).pathname.replace('/', '');
  block.firstElementChild.append(
    ...list.filter((eachList) => eachList.tag.includes(path)).map((eachData) => div(
      { class: 'blog-card' },
      div({ class: 'blog-card-img' }, img({ src: '/images/king-of-hammer.png' })),
      div(
        { class: 'blog-card-content' },
        div(
          { class: 'blog-card-tags' },
          ul(...eachData.tag.split(',').map((eachTag) => (li(eachTag)))),
        ),
        div({ class: 'blog-card-description' }, h5(eachData.title), p(eachData.description)),
        div({ class: 'blog-card-btn' }, a({ href: eachData.path }, 'Read More')),
      ),
    )),
  );
}
