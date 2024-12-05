import { Input, InputNumber, Modal, notification, Select } from "antd"
import { useState } from "react";
import { createBookAPI, handleUploadFile } from "../../services/api.service";

const CreateBookControl = (props) => {

    const { isCreateOpen, setIsCreateOpen, loadBook } = props;

    const [mainText, setMainText] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSubmitBtn = async () => {
        if (!selectedFile) {
            notification.error({
                message: "Error create book",
                description: "Vui lòng upload ảnh thumbnail"
            })
            return;
        }
        // step 1: upload file
        const resUpload = await handleUploadFile(selectedFile, "book");
        if (resUpload.data) {
            //success
            const newThumbnail = resUpload.data.fileUploaded;

            console.log(">>>> check resUpload: ", resUpload);
            ///step 2: create book
            const resBook = await createBookAPI(newThumbnail, mainText, author, price, quantity, category);

            if (resBook.data) {
                resetAndCloseModal();
                await loadBook();
                notification.success({
                    message: "Create book",
                    description: "Tạo mới book thành công"
                })
            } else {
                notification.error({
                    message: "Error create book",
                    description: JSON.stringify(resBook.message)
                })
            }

        } else {
            //failed
            notification.error({
                message: "Error upload file",
                description: JSON.stringify(resUpload.message)
            })
        }
    }

    const resetAndCloseModal = () => {
        setIsCreateOpen(false);
        setPreview(null);
        setSelectedFile(null);

        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");
    }

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const file = event.target.files[0];
        console.log(">>> check event: ", event)
        if (file) {
            setSelectedFile(file); //String tên file
            setPreview(URL.createObjectURL(file));
        }
    }

    return (
        <Modal
            title="Create Book"
            open={isCreateOpen}
            onOk={() => { handleSubmitBtn() }}
            onCancel={() => { resetAndCloseModal() }}
            maskClosable={false}
            okText={"CREATE"}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Tiêu đề</span>
                    <Input
                        value={mainText}
                        onChange={(event) => { setMainText(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Tác giả</span>
                    <Input
                        value={author}
                        onChange={(event) => { setAuthor(event.target.value) }} />
                </div>
                <div>
                    <div>Giá tiền</div>
                    <InputNumber
                        style={{ width: "100%" }}
                        addonAfter={' đ'}
                        value={price}
                        onChange={(event) => { setPrice(event) }} />
                </div>
                <div>
                    <div>Số lượng</div>
                    <InputNumber
                        style={{ width: "100%" }}
                        value={quantity}
                        onChange={(event) => { setQuantity(event) }} />
                </div>
                <div>
                    <div>Thể loại</div>
                    <Select
                        style={{
                            width: "100%",
                        }}
                        value={category}
                        onChange={(value) => { setCategory(value) }}
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
                </div>
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
                        onClick={(event) => event.target.value = null} />
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
        </Modal>
    )

}
export default CreateBookControl;