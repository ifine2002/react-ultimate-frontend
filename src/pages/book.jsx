import { useEffect, useState } from "react";
import BookTable from "../components/book/book.table";
import { fetchAllBookAPI } from "../services/api.service";

const BookPage = () => {
    return (
        <div style={{ padding: "20px" }}>
            <BookTable />
        </div>
    )
}
export default BookPage;