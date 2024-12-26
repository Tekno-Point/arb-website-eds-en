import { a, li, ul } from '../../scripts/dom-helpers.js';
import { getList } from '../taglist/taglist.js';

export default async function decorate(block) {
  const list = await getList();
  block.append(
    ul(
      ...list.map((eachData) => li(a({ href: eachData.path }, (`${eachData.category}-${eachData.count}`)))),
    ),
  );
}
