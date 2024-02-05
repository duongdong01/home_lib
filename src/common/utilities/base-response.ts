import { EResponse, IResponseCommon } from "../interface.common";

export function ReturnCommon(payload: IResponseCommon): IResponseCommon {
  return {
    status: EResponse.SUCCESS,
    statusCode: payload.statusCode,
    data: payload.data,
    message:
      payload.message && typeof payload.message === "string"
        ? [payload.message]
        : payload.message,
  };
}

export function paginateFind({
  totalDoc,
  page,
  limit,
}: {
  totalDoc: number;
  page: number;
  limit: number;
}) {}

export function paginating({
  totalDocs,
  page,
  limit,
}: {
  totalDocs: number;
  page: number;
  limit: number;
}) {
  const totalPage = Math.ceil(totalDocs / limit);
  const nextPage = page + 1 <= totalPage ? page + 1 : null;
  const prevPage = page - 1 > 0 ? page - 1 : null;
  const hasNextPage = page < totalPage ? true : false;
  const hasPrevPage = page > 1 ? true : false;

  return {
    totalDocs,
    totalPage,
    nextPage,
    prevPage,
    page,
    hasNextPage,
    hasPrevPage,
  };
}
