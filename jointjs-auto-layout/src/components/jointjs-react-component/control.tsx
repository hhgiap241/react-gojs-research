import { useStore, actions } from "./store"

function Control() {
  const [state, dispatch] = useStore()
  const { control } = state

  return <div>
    <button onClick={() => dispatch(actions.changeControl())}>Click</button>
    {control}
  </div>
}

export default Control
