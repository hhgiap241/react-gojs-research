import React from 'react';
import * as go from 'gojs';
import {DiagramWrapper} from "./DiagramWrapper";
import InitData from "../utils/InitData";

interface AppState {
  // ...
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedKey: number | null;
  skipsDiagramUpdate: boolean;
}

export class StateDiagram extends React.Component<{}, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      // ...
      nodeDataArray: InitData.getNodeDataArray(),
      linkDataArray: InitData.getLinkDataArray(),
      modelData: {
        canRelink: true
      },
      selectedKey: null,
      skipsDiagramUpdate: false
    };
    // bind handler methods
    this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleRelinkChange = this.handleRelinkChange.bind(this);
    this.handleResetDiagramBtn = this.handleResetDiagramBtn.bind(this);
  }

  /**
   * Handle any app-specific DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedKey state.
   *
   * This is not required, and is only needed when handling DiagramEvents from the GoJS diagram.
   * @param e a GoJS DiagramEvent
   */
  public handleDiagramEvent(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        if (sel) {
          this.setState({ selectedKey: sel.key });
        } else {
          this.setState({ selectedKey: null });
        }
        break;
      }
      default: break;
    }
  }

  /**
   * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
   * This method should iterates over those changes and update state to keep in sync with the GoJS model.
   * This can be done via setState in React or another preferred state management method.
   * @param obj a JSON-formatted string
   */
  public handleModelChange(obj: go.IncrementalData) {
    const insertedNodeKeys = obj.insertedNodeKeys
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;
    console.log(obj);

    // see gojs-react-basic for an example model change handler
    // when setting state, be sure to set skipsDiagramUpdate: true since GoJS already has this update
  }

  /**
   * Handle changes to the checkbox on whether to allow relinking.
   * @param e a change event from the checkbox
   */
  public handleRelinkChange(e: any) {
    const target = e.target;
    const value = target.checked;
    this.setState({ modelData: { canRelink: value }, skipsDiagramUpdate: false });
  }
  public handleResetDiagramBtn(e: any) {
    this.setState({ modelData: { canRelink: true }, skipsDiagramUpdate: false });
  }
  public render() {
    let selKey;
    if (this.state.selectedKey !== null) {
      selKey = <p>Selected key: {this.state.selectedKey}</p>;
    }

    return (
        <div>
          <DiagramWrapper
              nodeDataArray={this.state.nodeDataArray}
              linkDataArray={this.state.linkDataArray}
              modelData={this.state.modelData}
              skipsDiagramUpdate={this.state.skipsDiagramUpdate}
              onDiagramEvent={this.handleDiagramEvent}
              onModelChange={this.handleModelChange}
          />
          <label>
            Allow Relinking?
            <input
                type='checkbox'
                id='relink'
                checked={this.state.modelData.canRelink}
                onChange={this.handleRelinkChange} />
          </label>
          {selKey}
          <button onClick={this.handleResetDiagramBtn}>Reset Diagram</button>
        </div>
    );
  }
}