// https://fontawesome.com/v4.7/icons/

// define icon and color
import * as joint from "jointjs";

const WFShape_BaseColor = "#daecf2"
const WFShape_InColor = "#4fa8d1"
const WFShape_OutColor = "#daf2dc"
const WFShape_CallIcon = '\uf0ac';
const WFShape_AssignIcon = '\uf061';
const WFShape_SwitchIcon = '\uf047';
const WFShape_ReturnIcon = '\uf00c';
const WFRectangle_Width = 140;
const WFRectangle_Height = 70;
const WFCircle_Width = 60;
const WFCircle_Height = 60;
const WFShape_RemoveDistance = -30;

const WFShapeMap = {
  "call": {
    "icon": WFShape_CallIcon
  },
  "assign": {
    "icon": WFShape_AssignIcon
  },
  "switch": {
    "icon": WFShape_SwitchIcon
  },
  "return": {
    "icon": WFShape_ReturnIcon
  }
}

const portsDef = {
  groups: {
    'in': {
      position: "left",
      attrs: {
        circle: {
          fill: WFShape_InColor,
          stroke: 'black',
          'stroke-width': 1,
          r: 8,
          magnet: true
        }
      }
    },
    'out': {
      position: "right",
      attrs: {
        circle: {
          fill: WFShape_OutColor,
          stroke: 'black',
          'stroke-width': 1,
          r: 8,
          magnet: true
        }
      }
    },
    'out-condition': {
      position: "right",
      attrs: {
        circle: {
          fill: WFShape_OutColor,
          stroke: 'black',
          'stroke-width': 1,
          r: 8,
          magnet: true
        },
        text: {fill: '#6a6c8a', fontSize: 14,}
      },
      label: {
        position: {
          name: 'outsideOriented',
          args: {
            offset: 15,
            attrs: {}
          }
        }
      },
    }

  },
  items: []
};

// create a custom element
const WFRect = joint.dia.Element.define('workflow.Rectangle', {
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 2,
      stroke: '#000000',
      fill: '#FFFFFF'
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333'
    },
    icon: {
      text: WFShape_CallIcon,
      fontFamily: 'FontAwesome',
      fontSize: 15,
      textWrap: {
        width: -10
      },
      refX: '5%',
      refY: '7%',
    }
  }
}, {
  markup: [{
    tagName: 'rect', // the type of element to be created
    selector: 'body', //  A unique selector for targeting the element within the attr cell attribute.
  }, {
    tagName: 'text',
    selector: 'label'
  }, {
    tagName: 'text',
    selector: 'icon'
  }]
});

// create a custom element like WFRect but with circle
const WFCircle = joint.dia.Element.define('workflow.Circle', {
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 2,
      stroke: '#000000',
      fill: '#FFFFFF',
      cx: 'calc(0.5*w)',
      cy: 'calc(0.5*h)',
      rx: 'calc(0.5*w)',
      ry: 'calc(0.5*h)',
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333'
    },
    // icon: {
    //   text: WFShape_CallIcon,
    //   fontFamily: 'FontAwesome',
    //   fontSize: 15,
    //   textWrap: {
    //     width: -10
    //   },
    //   refX: '5%',
    //   refY: '7%',
    // }
  }
}, {
  markup: [{
    tagName: 'ellipse',
    selector: 'body',
  }, {
    tagName: 'text',
    selector: 'label'
  },
    // {
    //   tagName: 'text',
    //   selector: 'icon'
    // }
  ]
});

export {
  WFShape_BaseColor,
  WFShape_InColor,
  WFShape_OutColor,
  WFShape_CallIcon,
  WFShape_AssignIcon,
  WFShape_SwitchIcon,
  WFShape_ReturnIcon,
  WFRectangle_Width,
  WFRectangle_Height,
  WFCircle_Width,
  WFCircle_Height,
  WFShape_RemoveDistance,
  WFShapeMap,
  portsDef,
  WFRect,
  WFCircle
}