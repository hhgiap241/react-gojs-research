import * as joint from "jointjs";


const initState = {
  graph: null,
  paper: null,
  control: 0
}


function reducers(state: any, action: any) {
  switch (action.type) {
    case "INIT":
      const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });

      const paper = new joint.dia.Paper({
        model: graph,
        background: {
          color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        sorting: joint.dia.Paper.sorting.APPROX,
        cellViewNamespace: joint.shapes,
        width: '100%',
        height: '100%',
        gridSize: 20,
      });

      return { ...state, graph, paper }
    case 'CHANGE_CONTROL':
      return {
        ...state,
        control: state.control++

      }
    default:
      return state
  }
}

export default reducers
export { initState }
