import { getQueryList } from '../../scripts/common.js';
import { pubSubClient } from '../blog-list/blog-list.js';

export default async function decorate(block) {
  //   <div class="carousel-container">
  //         <div id="carousel" class="carousel">
  //             <!-- Items will be dynamically inserted here -->
  //         </div>
  //     </div>
  block.innerHTML = `

    <div class="pagination">
        <button class="page-btn prev-btn" id="prevBtn">&laquo;</button>
        <div id="pageNumbers"></div>
        <button class="page-btn next-btn" id="nextBtn">&raquo;</button>
    </div>`;

  //   const items = Array.from({ length: 82 }, (_, i) => `Item ${i + 1}`); // 50 items
  const list = await getQueryList();
  //   console.log(list);
  const url = new URL(window.location.href);
  const path = url.pathname.replace('/', '');
  const items = list
    .filter((eachList) => (!eachList.path.endsWith(path) && eachList.tag.includes(path)));

  const itemsPerPage = 2; // Show 4 items per page
  let currentPage = 1;

  function renderItems() {
    // const carousel = block.querySelector('#carousel');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    //   console.log(list);

    const itemsToShow = items.slice(startIndex, endIndex); // Get items for the current page
    pubSubClient.publish('update-blog-list', itemsToShow);
    // carousel.innerHTML = itemsToShow
    //     .map((item) => `<div class="carousel-item">${item}</div>`)
    //     .join('');
  }

  function createPageButton(page, container) {
    const pageNumberBtn = document.createElement('button');
    pageNumberBtn.textContent = page;
    pageNumberBtn.className = `page-btn ${page === currentPage ? 'active' : ''}`;
    pageNumberBtn.addEventListener('click', () => goToPage(page)); // eslint-disable-line no-use-before-define
    container.appendChild(pageNumberBtn);
  }

  function createEllipsis(container) {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.className = 'ellipsis';
    container.appendChild(ellipsis);
  }

  function renderPagination() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pageNumbersContainer = block.querySelector('#pageNumbers');
    pageNumbersContainer.innerHTML = '';

    // Always show the first page
    if (currentPage > 4) {
      createPageButton(1, pageNumbersContainer);
      createEllipsis(pageNumbersContainer);
    }

    // Show 3 siblings before and after the current page
    const siblingsCount = 2;
    const startPage = Math.max(1, currentPage - siblingsCount);
    const endPage = Math.min(totalPages, currentPage + siblingsCount);

    for (let i = startPage; i <= endPage; i = +1) {
      createPageButton(i, pageNumbersContainer);
    }

    // Always show the last page
    if (currentPage < totalPages - siblingsCount) {
      createEllipsis(pageNumbersContainer);
      createPageButton(totalPages, pageNumbersContainer);
    }

    // Update prev/next buttons
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
  }
  function goToPage(page) {
    currentPage = page;
    renderPagination();
    renderItems();
  }

  // Add event listeners for prev/next buttons
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });

  // Initial render
  renderItems();
  renderPagination();
}
