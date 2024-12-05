//() => {}
//component = html + css + js

//JSX
//fragment
import './style.css';

const MyComponent = () => {
    // const hoidanit = "eric1"; //string
    // const hoidanit = 25; //number
    const hoidanit = [1, 2, 3, 4];
    // const hoidanit = {
    //     name: "hoidanit",
    //     age: 25
    // }
    return (
        <>
            <div> {JSON.stringify(hoidanit)} & hoidanit </div>
            <div>{console.log("Eric")}</div>
            <div className="child"
                style={{ borderRadius: "10px" }}>child</div>
        </>
    );
}

export default MyComponent;