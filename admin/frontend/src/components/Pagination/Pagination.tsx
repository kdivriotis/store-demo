import { FC } from "react";
import { useWindowDimensions } from "../../hooks";

import styles from "./Pagination.module.css";

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

/**
 * Maximum number of pages displayed based on current window's width
 * @param {number} width Current window's width (in pixels)
 * @return {number} Maximum number of pages to be displayed
 */
const calculateMaxPagesDisplayed = (width: number): number => {
  if (width <= 650) {
    return 5;
  } else if (width <= 1150) {
    return 7;
  } else if (width <= 1400) {
    return 15;
  } else {
    return 20;
  }
};

/**
 * Construct the list of available pages to be displayed for selection
 * @param {number} currentPage The currently selected page
 * @param {number} numberOfPages The total number of pages that are needed to display all items
 * @param {number} maximumPages The maximum number of pages that can be displayed at once
 * @return {string[]} The list of all page numbers to be displayed
 */
const constructAvailablePagesArray = (
  currentPage: number,
  numberOfPages: number,
  maximumPages: number
): string[] => {
  let pages: string[] = [];
  if (numberOfPages >= 1) {
    // if number of pages is <= maximum number of pages, display all pages
    if (numberOfPages <= maximumPages) {
      pages = Array.from({ length: numberOfPages }, (_, i) => `${i + 1}`);
    }
    // current page is <= maximum pages-2: display all pages from 1 to maximum pages-2, then ... and the last page
    else if (currentPage <= maximumPages - 2) {
      pages = Array.from({ length: maximumPages - 2 }, (_, i) => `${i + 1}`);
      pages.push("");
      pages.push(`${numberOfPages}`);
    }
    // distance from current page to last page is <= maximum pages-2: display 1, ..., last <maximumPages - 2> pages
    else if (numberOfPages - currentPage < maximumPages - 2) {
      pages.push("1");
      pages.push("");
      for (let i = maximumPages - 3; i >= 0; i--) {
        pages.push(`${numberOfPages - i}`);
      }
    } else {
      pages.push("1");
      pages.push("");
      let firstPage = currentPage - Math.trunc((maximumPages - 4) / 2);
      if (maximumPages % 2 === 0) {
        firstPage++;
      }
      for (let i = firstPage; i <= currentPage; i++) {
        pages.push(`${i}`);
      }
      let lastPage = currentPage + Math.floor((maximumPages - 4) / 2);
      for (let i = currentPage + 1; i <= lastPage; i++) {
        pages.push(`${i}`);
      }
      pages.push("");
      pages.push(`${numberOfPages}`);
    }
  }

  return pages;
};

const Pagination: FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}) => {
  /*** Pagination for items, to handle large number of data ***/
  const dimensions = useWindowDimensions(); // get current dimensions of the window
  const width: number = dimensions?.width ?? 800;
  const maxPagesDisplayed = calculateMaxPagesDisplayed(width); // maximum number of pages displayed on page selection bar
  const numberOfPages = // number of pages needed, based on <totalItems> and <itemsPerPage>
    itemsPerPage > 0 && totalItems > 0
      ? Math.trunc(totalItems / itemsPerPage) +
        (totalItems % itemsPerPage > 0 ? 1 : 0)
      : 1;

  // in case of invalid selected page (> max), go to last page
  if (currentPage > numberOfPages) {
    setCurrentPage(numberOfPages);
  }

  // create page selection bar
  let pages = constructAvailablePagesArray(
    currentPage,
    numberOfPages,
    maxPagesDisplayed
  );

  return (
    <div className={styles["pagination"]}>
      <nav className={styles["pagination_container"]}>
        <ul className={styles["pagination_list"]}>
          <li>
            <button
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
              }
              className={styles["pagination_list_btn"]}
            >
              {"<"}
            </button>
          </li>
          <li>
            {pages.map((page, index) => {
              if (page === "") {
                return (
                  <button
                    disabled
                    key={`el-${index}`}
                    className={styles["pagination_list_btn"]}
                  >
                    {"..."}
                  </button>
                );
              } else {
                return (
                  <button
                    key={`pg-${page}`}
                    onClick={() => setCurrentPage(parseInt(page))}
                    className={
                      currentPage === parseInt(page)
                        ? styles["pagination_list_btn_active"]
                        : styles["pagination_list_btn"]
                    }
                  >
                    {page}
                  </button>
                );
              }
            })}
          </li>
          <li>
            <button
              onClick={() =>
                setCurrentPage(
                  currentPage < numberOfPages ? currentPage + 1 : numberOfPages
                )
              }
              className={styles["pagination_list_btn"]}
            >
              {">"}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
