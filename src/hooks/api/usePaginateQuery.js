import React from "react";
import { useQuery } from "react-query";
import { request } from "../../services/api";
import {notification} from "antd";

const usePaginateQuery = ({
  key = "get-all",
  url = "/",
  page = 1,
  params = {},
  showSuccessMsg = false,
  showErrorMsg = false,
}) => {
  const { isLoading, isError, data, error, isFetching, refetch} = useQuery(
    [key, page, params],
    () => request.get(`${url}?page=${page}`, params),
    {
      keepPreviousData: true,
      onSuccess: () => {
        if (showSuccessMsg) {
          notification.success(t("SUCCESS"));
        }
      },
      onError: (data) => {
        if (showErrorMsg) {
          notification.error(t(data?.response?.data?.message || `ERROR`));
        }
      },
    }
  );

  return {
    isLoading,
    isError,
    data,
    error,
    isFetching,
    refetch
  };
};

export default usePaginateQuery;
