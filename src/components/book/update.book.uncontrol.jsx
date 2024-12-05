import { Form, Input, InputNumber, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { handleUploadFile, updateBookAPI } from "../../services/api.service";

const UpdateBookUncontrol = (props) => {
    const { dataUpdate,
        setDataUpdate,
        isModalUpdateOpen,
        setIsModalUpdateOpen,
        loadBook } = props;
    const [form] = Form.useForm();

    const resetAndCloseModal = () => {
        form.resetFields();
        setPreview(null);
        setDataUpdate(null);
        setSelectedFile(null);
        setIsModalUpdateOpen(false);
    }
    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            form.setFieldsValue({
                id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                quantity: dataUpdate.quantity,
                category: dataUpdate.category
            })
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`)
        }
    }, [dataUpdate])

    const updateBook = async (newThumbnail, values) => {
        const { id, mainText, author, price, quantity, category } = values;
        const resBook = await updateBookAPI(id, newThumbnail, mainText, author, price, quantity, category);
        if (resBook.data) {
            resetAndCloseModal();
            await loadBook();
            notification.success({
                message: "Update book",
                description: "Cập nhật book thành công"
            })
        } else {
            notification.error({
                message: "Error update book",
                description: JSON.stringify(resBook.message)
            })
        }
    }

    const handleSubmitBtn = async (values) => {
        //không có ảnh preview + không có file => return
        if (!selectedFile && !preview) {
            notification.error({
                message: "Error update book",
                description: "Vui lòng upload ảnh thumbnail"
            })
            return;
        }

        let newThumbnail = "";
        // có ảnh preview và không có file => không upload file
        if (!selectedFile && preview) {
            newThumbnail = updateBook.thumbnail;
        } else {
            // có ảnh preview và có file => upload file
            const resUpload = await handleUploadFile(selectedFile, "book");
            if (resUpload.data) {
                //success
                newThumbnail = resUpload.data.fileUploaded;
            } else {
                //failed
                notification.error({
                    message: "Error upload file",
                    description: JSON.stringify(resUpload.message)
                })
                return;
            }
        }

        //step 2: update book
        //khi ấn submit form => data sẽ được lưu vào values => truyền vào update book
        await updateBook(newThumbnail, values);
    }

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file))
        }
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    return (
        <Modal
            title="Update Book (uncontrolled component"
            open={isModalUpdateOpen}
            onOk={() => form.submit()}
            onCancel={() => { resetAndCloseModal() }}
            maskClosable={false}
            okText={"UPDATE"}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitBtn}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <Form.Item
                            label="Id"
                            name="id"
                        >
                            <Input
                                disabled />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Tiêu đề"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tiêu đề không được để trống!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Tác giả"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tác giả không được để trống!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Giá tiền"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Giá tiền không được để trống!',
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                addonAfter={' đ'} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Số lượng không được để trống!',
                                }
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Thể loại"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Thể loại không được để trống!',
                                }
                            ]}
                        >
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                name="category"
                                options={[
                                    { value: 'Arts', label: 'Arts' },
                                    { value: 'Business', label: 'Business' },
                                    { value: 'Comics', label: 'Comics' },
                                    { value: 'Cooking', label: 'Cooking' },
                                    { value: 'Entertainment', label: 'Entertainment' },
                                    { value: 'History', label: 'History' },
                                    { value: 'Music', label: 'Music' },
                                    { value: 'Sports', label: 'Sports' },
                                    { value: 'Teen', label: 'Teen' },
                                    { value: 'Travel', label: 'Travel' },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <div>
                            <div>Ảnh thumbnail</div>
                            <label htmlFor="btnUpload" style={{
                                display: "block",
                                width: "fit-content",
                                marginTop: "15px",
                                padding: "5px 10px",
                                background: "orange",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}>Upload</label>
                            <input
                                type="file" hidden id="btnUpload"
                                onChange={(event) => handleOnChangeFile(event)}
                                //fix bug khi click lại ảnh đã chọn trc đó
                                onClick={(event) => event.target.value = null}
                                style={{ display: "none" }} />
                        </div>
                        {preview &&
                            <>
                                <div style={{
                                    marginTop: "10px",
                                    marginBottom: "15px",
                                    height: "150px", width: "200px",
                                }}>
                                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                                        src={preview} />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Form>
        </Modal>
    )
}
export default UpdateBookUncontrol;