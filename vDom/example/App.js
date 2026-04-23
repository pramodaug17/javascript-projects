
/** @jsx createElement */
function App() {
  ///----------- useState ----------
  const [count, setCount] = useState(0);

  ///----------- useMemo -----------
  const expensive = useMemo(() => {
    console.log("expensive calculation");
    return count * 1000;
  }, [count]);

  ////---------- useCallback ---------
  const onIncrement = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  ////---------- useEffect -----------
  useEffect(() => {
    console.log("Effect run count", count);

    return () => {
      console.log("Cleanup run count: ", count);
    };
  }, [count]);

  ////----------------- Create Element ---------------------------------
  return createElement(
    "div",
    null,
    "Value: ", expensive,
    createElement(Button, {onSendData: onIncrement})
  );
}

function Button(props) {
  function clickHandler() {
    // call the callback from parent
    props?.onSendData();
  }
  return createElement(
    "button",
    { onclick: clickHandler },
    "Increment"
  );
}

const root = document.getElementById("root");
render(createElement(App), root);
