import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {useTranslation} from "react-i18next";
import {notification} from "antd";

const deleteRequest = (url) => request.delete(url);

const useDeleteQuery = ({listKeyId = null}) => {
        const {t} = useTranslation();
        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url
             }) => deleteRequest(url),
            {
                onSuccess: (data) => {
                    notification.success(t(data?.data?.message || 'SUCCESSFULLY DELETED'))

                    if (listKeyId) {
                        queryClient.invalidateQueries(listKeyId)
                    }
                },
                onError: (data) => {
                    notification.error(t(data?.response?.data?.message || 'ERROR'))
                }
            }
        );

        return {
            mutate,
            isLoading,
            isError,
            error,
            isFetching
        }
    }
;

export default useDeleteQuery;
