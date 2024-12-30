import {
  a, div, li, ul, span,
} from '../../scripts/dom-helpers.js';
import { getList } from '../taglist/taglist.js';
import decorateAccordion from '../accordion/accordion.js';

export default async function decorate(block) {
  const list = await getList();

  block.firstElementChild.append(
    div(
      ul(
        ...list.map((eachData) => li(a({ href: eachData.path }, (`${eachData.category}`)), span(`${eachData.count}`))),
      ),
    ),
  );

  if (window.innerWidth < 769) {
    decorateAccordion(block);
  }
}
