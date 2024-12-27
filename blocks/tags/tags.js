import { getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  const cqtags = getMetadata('cq-tags');
  const rawTags = cqtags ? cqtags.trim().split(',') : [];
  rawTags.forEach((eachRawTag) => {
    const tag = eachRawTag.split('/')[1];
    block.firstElementChild.append(
      tag,

    );
  });
}
