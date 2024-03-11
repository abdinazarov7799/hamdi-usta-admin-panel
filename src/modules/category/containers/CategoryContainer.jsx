import React, {useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Space, Switch, Table} from "antd";
import Container from "../../../components/Container.jsx";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import CreateCategory from "../components/CreateCategory.jsx";
import EditCategory from "../components/EditCategory.jsx";

const CategoryContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [itemData, setItemData] = useState(null);
    const [searchKey,setSearchKey] = useState('');
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.category_get_all,
        url: URLS.category_get_all,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });
    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.category_get_all
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.category_delete}/${id}`},{
            onSuccess: () => {
                refetch();
            }
        })
    }
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 30
        },
        {
            title: "nameUz",
            dataIndex: "nameUz"
        },
        {
            title: "nameRu",
            dataIndex: "nameRu"
        },
        {
            title: "descriptionUz",
            dataIndex: "descriptionUz"
        },
        {
            title: "descriptionRu",
            dataIndex: "descriptionRu"
        },
        {
            title: "number",
            dataIndex: "number",
            width: 70
        },
        {
            title: "active",
            dataIndex: "active",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'active')} />
            )
        },
        {
            title: "edit / delete",
            width: 120,
            fixed: 'right',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setItemData(data)
                    }} />
                    <Popconfirm
                        title={t("Delete category")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return(
      <Container>
          <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
              <Space size={"middle"}>
                  <Input.Search
                      placeholder={t("Search")}
                      onChange={(e) => setSearchKey(e.target.value)}
                      allowClear
                  />
                  <Button
                      type={"primary"}
                      onClick={() => setIsCreateModalOpen(true)}
                  >
                      {t("New category")}
                  </Button>
                  <Modal
                      title={t('Create new category')}
                      open={isCreateModalOpenCreate}
                      onCancel={() => setIsCreateModalOpen(false)}
                      footer={null}
                  >
                      <CreateCategory setIsModalOpen={setIsCreateModalOpen} refetch={refetch}/>
                  </Modal>
              </Space>

              <Table
                  columns={columns}
                  dataSource={get(data,'data.data.content',[])}
                  bordered
                  size={"middle"}
                  pagination={false}
                  loading={isLoading}
              />

              <Modal
                  title={t("Edit category")}
                  open={isEditModalOpen}
                  onCancel={() => setIsEditModalOpen(false)}
                  footer={null}
              >
                  <EditCategory
                      itemData={itemData}
                      setIsModalOpen={setIsEditModalOpen}
                      refetch={refetch}
                  />
              </Modal>

              <Row justify={"end"} style={{marginTop: 10}}>
                  <Pagination
                      current={page+1}
                      onChange={(page) => setPage(page - 1)}
                      total={get(data,'data.data.totalPages') * 10 }
                      showSizeChanger={false}
                  />
              </Row>
          </Space>
      </Container>
  )
}
export default CategoryContainer
