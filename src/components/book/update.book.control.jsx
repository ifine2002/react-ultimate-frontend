import { Input, InputNumber, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { handleUploadFile, updateBookAPI } from "../../services/api.service";

const UpdateBookControl = (props) => {
    const { dataUpdate, setDataUpdate, isModalUpdateOpen, setIsModalUpdateOpen, loadBook } = props;


    const [id, setID] = useState("");
    const [mainText, setMainText] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);


    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            setID(dataUpdate._id);
            setMainText(dataUpdate.mainText);
            setAuthor(dataUpdate.author);
            setPrice(dataUpdate.price);
            setQuantity(dataUpdate.quantity);
            setCategory(dataUpdate.category);
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`)
        }
    }, [dataUpdate])

    const updateBook = async (newThumbnail) => {
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
    const handleSubmitBtn = async () => {
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
        await updateBook(newThumbnail);
    }

    const resetAndCloseModal = () => {
        setID("");
        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");

        setPreview(null);
        setIsModalUpdateOpen(false);
        setDataUpdate(null);
        setSelectedFile(null);
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

    return (
        <Modal
            title="Update Book"
            open={isModalUpdateOpen}
            onOk={() => { handleSubmitBtn() }}
            onCancel={() => { resetAndCloseModal() }}
            maskClosable={false}
            okText={"UPDATE"}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Id</span>
                    <Input
                        value={id}
                        disabled />
                </div>
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
export default UpdateBookControl;