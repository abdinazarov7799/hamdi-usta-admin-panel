import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {useTranslation} from "react-i18next";
import {notification} from "antd";

const putRequest = (url, attributes) => request.put(url, attributes);

const usePutQuery = ({hideSuccessToast = false, listKeyId = null}) => {
    const {t} = useTranslation();

        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url, attributes
             }) => putRequest(url, attributes),
            {
                onSuccess: (data) => {
                    if (!hideSuccessToast) {
                        notification.success(t(data?.data?.message || 'SUCCESS'))
                    }

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
            isFetching,
        }
    }
;

export default usePutQuery;
