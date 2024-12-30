import {
  a, div, li, ul, img, h5, p,
} from '../../scripts/dom-helpers.js';
import { getList } from '../taglist/taglist.js';

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
  const list = await getList();
  console.log(list);

  block.firstElementChild.append(
    ...[1,2,3,4,5,6,7,8,9].map((eachData) => div(
      { class: 'blog-card' },
      div({ class: 'blog-card_img' }, img({ src: '/images/king-of-hammer.png' })),
      div(
        { class: 'blog-card_content' },
        div(
          { class: 'blog-card_tags' },
          ul(...[
            {
                "tag": "act"
            },
            {
                "tag": "campaign"
            },
            {
                "tag": "fishing"
            }
        ].map((eachTag) => (li(eachTag.tag)))),
        ),
        div({ class: 'blog-card_description' }, h5('King of the Hammers'), p('Read more about ARB’s dominant performance at the famous desert racing and rock crawling event.')),
        div({ class: 'blog-card_btn' }, a({ src: '/' }, 'Read More')),
      ),
    )),
  );
}
