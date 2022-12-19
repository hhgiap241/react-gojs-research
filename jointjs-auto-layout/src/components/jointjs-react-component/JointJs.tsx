import Paper from "./Paper";
import { Provider } from "./store";

function JointJs({ children }: { children: any }) {
  return (
    <Provider>
      <Paper />
      {children}
    </Provider>
  )
}

export default JointJs
