import {ObjectData} from "gojs";
import * as fs from 'fs';

class DiagramHelper{

  saveDiagramToJSON(nodeDataArray: ObjectData[], linkDataArray: ObjectData[]) {
    const data = {
      nodeDataArray: nodeDataArray,
      linkDataArray: linkDataArray
    }
    // fs.writeFile('../jsonSrc/diagram.json', JSON.stringify(data), (err: any) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('File saved!');
    //   }
    // });
  }
}

export default new DiagramHelper();