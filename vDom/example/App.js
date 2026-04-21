/** @jsx createElement */
function Counter() {
    const [count, setCount] = useState(0);
    return createElement(
        "button",
        { onclick: () => setCount(count + 1) },
        "Count: ", count
    );
}
const root = document.getElementById("root");
render(createElement(Counter), root);