import { memo, useEffect, useRef } from "react";
import { actions, useStore } from "./store";
import styles from "./index.module.scss"

function Paper(): JSX.Element {
  const canvas = useRef(null);

  const [state, dispatch] = useStore()
  const { paper } = state

  useEffect(() => {
    dispatch(actions.init())

    return () => {
      paper.remove();
    };
  }, [])

  useEffect(() => {
    if (paper && canvas.current) {
      // @ts-ignore
      canvas.current?.appendChild(paper.el);
    }
  }, [paper])
  console.log("render paper")

  return <div className={styles.canvas} ref={canvas} />
}

export default Paper 
