import { useState } from "react";

const TodoNew = (props) => {

    //useState hook
    // const valueInput = "Eric";
    const [valueInput, setValueInput] = useState("Eric")

    const { addNewTodo } = props;
    // addNewTodo("eric");
    const handleClick = () => {
        addNewTodo(valueInput);
        setValueInput("");
    }
    const handleChange = (name) => {
        setValueInput(name);
    }

    return (
        <div className='todo-new'>
            <input type="text"
                onChange={(event) => handleChange(event.target.value)}
                value={valueInput}
            />
            <button
                style={{ cursor: "pointer" }}
                onClick={handleClick}
            >Add</button>
        </div>
    )
}
export default TodoNew;