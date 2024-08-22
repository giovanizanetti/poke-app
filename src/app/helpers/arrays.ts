/**
 *
 * @param pageIndex
 * @param perPage
 * @param data Array
 * @returns page data
 * @description Usefull when the data can not be fetched by page.
 */
export const getPageData = <T>(pageIndex: number, perPage: number, data: any): T => {
  const startIndex = pageIndex * perPage
  const endIndex = startIndex + perPage
  return data.slice(startIndex, endIndex)
}
