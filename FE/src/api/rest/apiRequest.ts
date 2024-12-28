import { ERROR } from "../../constants/constants.ts";

const apiRequest = async (
  requestUrl: string,
  requestInit: RequestInit = {},
  processData?: (data: any) => any
) => {
  let response: Response, data;
  try {
    response = await fetch(requestUrl, requestInit);
  } catch {
    throw new Error(ERROR.NETWORK);
  }
  if (response.status === 204) return; // No Content
  try {
    data = await response.json();
  } catch {
    throw new Error(ERROR.SERVER);
  }
  if (!response.ok && !data.error) throw new Error(ERROR.SERVER);
  return processData ? processData(data) : data;
};

export default apiRequest;
