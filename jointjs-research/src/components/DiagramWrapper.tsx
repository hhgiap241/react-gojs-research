import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

// props passed in from a parent component holding state, some of which will be passed to ReactDiagram
interface WrapperProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<WrapperProps, {}> {
  /**
   * Ref to keep a reference to the component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  constructor(props: WrapperProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener,
   * with the function using a switch statement to handle the events.
   * This is only necessary when you want to define additional app-specific diagram listeners.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   * This is only necessary when you have defined additional app-specific diagram listeners.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
        $(go.Diagram,
            {
              'undoManager.isEnabled': true,  // must be set to allow for model change listening
              // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
              'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
              model: new go.GraphLinksModel(
                  {
                    linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                    linkFromPortIdProperty: "fromPort",  // required information:
                    linkToPortIdProperty: "toPort",      // identifies data property names
                    // positive keys for nodes
                    makeUniqueKeyFunction: (m: go.Model, data: any) => {
                      let k = data.key || 1;
                      while (m.findNodeDataForKey(k)) k++;
                      data.key = k;
                      return k;
                    },
                    // negative keys for links
                    makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                      let k = data.key || -1;
                      while (m.findLinkDataForKey(k)) k--;
                      data.key = k;
                      return k;
                    }
                  }),
              // layout: $(go.TreeLayout, {comparer: go.LayoutVertex.smartComparer}),
              layout: $(go.LayeredDigraphLayout, { columnSpacing: 10 })
            });


    // define a simple Node template
    diagram.nodeTemplateMap.add("Task",
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
            // new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'RoundedRectangle',
                {
                  name: 'SHAPE', fill: 'white', strokeWidth: 0,
                  // set the port properties:

                },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')),
            $(go.Panel, "Table",
                $(go.RowColumnDefinition,
                    { column: 0, alignment: go.Spot.Left}),
                $(go.RowColumnDefinition,
                    { column: 2, alignment: go.Spot.Right }),
                $(go.TextBlock,
                    { margin: new go.Margin(4, 2), column: 0, row: 0, columnSpan: 3, editable: true, font: '400 .875rem Roboto, sans-serif', alignment: go.Spot.Center },  // some room around the text
                    new go.Binding('text').makeTwoWay()
                ),
                $(go.Panel, "Horizontal",
                    { column: 0, row: 1 },
                    $(go.Shape,  // the "A" port
                        { width: 6, height: 6, portId: "In", toSpot: go.Spot.Left,
                          toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links to here
                    $(go.TextBlock, "In")  // "A" port label
                ),
                $(go.Panel, "Horizontal",
                    { column: 2, row: 1, rowSpan: 2 },
                    $(go.TextBlock, "Out"),  // "Out" port label
                    $(go.Shape,  // the "Out" port
                        { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right,
                          fromLinkable: true })  // allow user-drawn links from here
                )
            )
            // $(go.TextBlock,
            //     { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
            //     new go.Binding('text').makeTwoWay()
            // )
        ));
    diagram.nodeTemplateMap.add("LogicalOperator",
        $(go.Node, 'Auto',
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'Ellipse',
                {
                  figure: "Ellipse",
                  desiredSize: new go.Size(30, 30)
                },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')),
            // $(go.Panel, "Table",
            //     $(go.RowColumnDefinition,
            //         { column: 0, alignment: go.Spot.Left}),
            //     $(go.RowColumnDefinition,
            //         { column: 2, alignment: go.Spot.Right }),
            //     $(go.TextBlock,
            //         { margin: new go.Margin(4, 2), column: 0, row: 0, columnSpan: 3, editable: true, font: '400 .875rem Roboto, sans-serif', alignment: go.Spot.Center },  // some room around the text
            //         new go.Binding('text').makeTwoWay()
            //     ),
            //     $(go.Panel, "Horizontal",
            //         { column: 0, row: 1 },
            //         $(go.Shape,  // the "A" port
            //             { width: 6, height: 6, portId: "In", toSpot: go.Spot.LeftCenter,
            //               toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links to here
            //         // $(go.TextBlock, "In")  // "A" port label
            //     ),
            //     $(go.Panel, "Horizontal",
            //         { column: 2, row: 1, rowSpan: 2 },
            //         // $(go.TextBlock, "Out"),  // "Out" port label
            //         $(go.Shape,  // the "Out" port
            //             { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.RightCenter,
            //               fromLinkable: true })  // allow user-drawn links from here
            //     )
            // )
            $(go.TextBlock,
                { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
                new go.Binding('text').makeTwoWay()
            )
        ));

    // relinking depends on modelData
    diagram.linkTemplate =
        $(go.Link,
            new go.Binding('relinkableFrom', 'canRelink').ofModel(),
            new go.Binding('relinkableTo', 'canRelink').ofModel(),
            $(go.Shape),
            $(go.Shape, { toArrow: 'Standard' })
        );
    diagram.toolManager.clickCreatingTool.archetypeNodeData = { text: 'new node', category: 'Task', color: 'lightgreen' };
    return diagram;
  }

  public render() {
    return (
        <ReactDiagram
            ref={this.diagramRef}
            divClassName='diagram-component'
            initDiagram={this.initDiagram}
            nodeDataArray={this.props.nodeDataArray}
            linkDataArray={this.props.linkDataArray}
            modelData={this.props.modelData}
            onModelChange={this.props.onModelChange}
            skipsDiagramUpdate={this.props.skipsDiagramUpdate}
        />
    );
  }
}