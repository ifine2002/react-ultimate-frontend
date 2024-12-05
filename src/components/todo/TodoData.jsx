
const TodoData = (props) => {

    const handleClick = (id) => {
        deleteTodo(id)
    }

    const { todoList, deleteTodo } = props;
    return (
        <div className='todo-data'>
            {todoList.map((item, index) => {
                // console.log(">>> check map: ", item, index)
                return (
                    <div className="todo-item" key={item.id}>
                        <div>{item.name}</div>

                        <button
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick(item.id)}>
                            Delete
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
export default TodoData;