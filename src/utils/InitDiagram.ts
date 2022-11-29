import * as go from 'gojs';

// helper functions for the templates
function nodeStyle(){
  return [
    {
      type: go.Panel.Spot,
      layerName: "Background",
      locationObjectName: "SHAPE",
      selectionObjectName: "SHAPE",
      locationSpot: go.Spot.Center
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
  ];
}

function shapeStyle(){
  return {
    name: "SHAPE",
    stroke: "black",
    fill: "#f0f0f0",
    portId: "", // So a link can be dragged from the Node: see /GraphObject.html#portId
    fromLinkable: true,
    toLinkable: true
  };
}

function textStyle(){
  return [
    {
      font: "bold 11pt helvetica, bold arial, sans-serif",
      margin: 2,
      editable: true
    },
    new go.Binding("text", "label").makeTwoWay()
  ];
}

class InitDiagram {
  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model and any templates.
   * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
   */

  initDiagram(): any {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
        $(go.Diagram,
            {
              'undoManager.isEnabled': true,  // must be set to allow for model change listening
              // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
              layout: $(go.TreeLayout, {comparer: go.LayoutVertex.smartComparer}),
              'clickCreatingTool.archetypeNodeData': {text: 'new node', color: 'lightblue'},
              model: new go.GraphLinksModel(
                  {
                    linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                  })
            });

    // define a simple Node template
    diagram.nodeTemplateMap.add("Task",
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'RoundedRectangle',
                {name: 'SHAPE', fill: 'white', strokeWidth: 0},
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')),
            $(go.TextBlock,
                {margin: 8, editable: true},  // some room around the text
                new go.Binding('text').makeTwoWay()
            )
        ));
    diagram.nodeTemplateMap.add("LogicalOperator",
        $(go.Node, nodeStyle(),
            {
              movable: true,
              layerName: "Foreground",
              alignmentFocus: go.Spot.None
            },
            $(go.Shape, shapeStyle(),
                {
                  figure: "Ellipse",
                  desiredSize: new go.Size(30, 30)
                }),
            $(go.TextBlock,
                {margin: 8, editable: true},  // some room around the text
                new go.Binding('text').makeTwoWay()
            )
        ));

    diagram.linkTemplate =
        $(go.Link,
            $(go.Shape),                           // this is the link shape (the line)
            $(go.Shape, { toArrow: "Standard" }),  // this is an arrowhead
            $(go.TextBlock,                        // this is a Link label
                new go.Binding("text", "text"))
        );

    return diagram;
  }
}

export default new InitDiagram();