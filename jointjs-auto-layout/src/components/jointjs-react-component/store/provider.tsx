import Context from './Context'
import { useReducer } from 'react'
import reducers, { initState } from "./reducers"

function Provider({ children }: { children: any }) {
  const [state, dispatch] = useReducer(reducers, initState)

  return (
    //@ts-ignore
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider >
  )
}

export default Provider
