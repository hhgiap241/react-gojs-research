import * as joint from 'jointjs';
import * as dagre from 'dagre';
import graphlib from 'graphlib';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Input from '@material-ui/core/Input';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import SettingsDialog from './SettingsDialog.js';
import YAMLInputDialog from './YAMLInputDialog.js';
import YAMLOutputDialog from './YAMLOutputDialog.js';
import clone from 'just-clone';
import yaml from 'js-yaml';
import WFUtils from './WFUtils'
import MessageDialog from './MessageDialog.js';
import JointJSUtils from './JointJSUtils.js';
import * as InitData from './utils/InitData.js';
import data from "./jsonSrc/original_data.json";
import {  WFShape_BaseColor,
    WFShape_InColor,
    WFShape_OutColor,
    WFShape_CallIcon,
    WFShape_AssignIcon,
    WFShape_SwitchIcon,
    WFShape_ReturnIcon,
    WFShape_Width,
    WFShape_Height,
    WFShape_RemoveDistance,
    WFShapeMap,
    portsDef,
    WFRect} from './utils/ShapeDefinition.js';
import * as DiagramHelper from './utils/DiagramHelper.js';

let initData = InitData.initData(data);
class MyJointJS extends React.Component {
    constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph({}, {cellNamespace: joint.shapes});
        this.state = {
            stepCount:  this.graph.getElements().length + 1,
            openLoad: false,
            openSave: false,
            saveText: "",
            loadText: "",
            settingsShowDialog: false, // Set to true to show the settings dialog.
            contextShowMenu: false, // Set to true to show the context menu.
            yamlInputShowDialog: false,
            yamlOutputShowDialog: false,
            systemShowMenu: false,
            aboutDialogOpen: false,
            yamlText: "",
            mouse: { x: 0, y: 0 },
            menuElement: null,
            anchorEl: null,
            wf: {},
            layoutDirection: "LR" // The layout of the graph ... LR for left->right or TB for top->bottom
        }
    }
    setState = this.setState.bind(this)

    componentDidMount() {
        console.log("Mounted!");

        this.paper = new joint.dia.Paper({
            el: this.el,
            model: this.graph,
            width: "100%",
            height: 600,
            gridSize: 1,
            background: {
                color: '#f0f0f0'
            },
            linkPinning: false,
            //defaultLink: new joint.shapes.standard.Link(),
            defaultLink: function (cellView, magnet) {
                const link = new joint.shapes.standard.Link();
                /*
                var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
                var toolsView = new joint.dia.ToolsView({
                    tools: [
                        targetArrowheadTool
                    ]
                });
                //var linkView = link.findView(paper);
                
                cellView.addTools(toolsView);
                */
                return link;
            },
            // Validate link connections.  When a link is being formed, we can examine the links and shut it down
            // if there is anything we don't like about it.
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                if (cellViewS === cellViewT) return false; // Don't allow a link to start and end at the same element.
                if (magnetT === undefined || magnetT.getAttribute('port-group') !== 'in') return false;  // If there is no target or the target is not an "in" port group, cancel it
                if (!magnetS.getAttribute('port-group').startsWith('out')) return false // If the source port group doesn't start with "out" then cancel it.
                // We need to check that the source doesn't ALREADY have a link in the graph!
                /*
                console.log("Source:");
                console.dir(cellViewS);
                console.log("magnetS");
                console.dir(magnetS)
                console.log('linkView');
                console.dir(linkView)
                console.dir(linkView.model.source())
                */
                const source = linkView.model.source()
                // Cound the number of outgoing links.  Hint ... it will be at least 1 as we have the CURRENT link
                if (JointJSUtils.countOutgoingLinks(this.model, source.id, source.port) > 1) {
                    return false;
                }
                return true;
            },
            interactive: function (cellView) {
                if (cellView.model.get('locked')) {
                    return {
                        elementMove: false
                    };
                }

                // otherwise
                return true;
            }
        });
        /*
        this.graph.on('all', function(eventName, cell) {
            console.log(arguments);
        });
        */
        /*
                this.graph.on('change:source change:target', function (link) {
                    console.log(`sourceId: ${link.get('source').id}, targetId: ${link.get('target').id} `)
                    if (link.get('source').id && link.get('target').id) {
                        // both ends of the link are connected.
                        //let lv = this.paper.findViewByModel(link);
                        //let linkView = link.findView(this.paper);
                        //linkView.removeTools();
                    }
                })
                */
        /*
                this.graph.on('add', function (cell) {
                    if (cell instanceof joint.dia.Link) {
                        var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
                        var toolsView = new joint.dia.ToolsView({
                          tools: [
                            targetArrowheadTool
                          ]
                        });
                        const linkView = cell.findView(this.paper);
                        if (linkView == null) return; 
                        linkView.addTools(toolsView);
                    }
                });
                */

        this.paper.on('link:pointerup', function (linkView) {
            if (linkView.hasTools()) return;
            linkView.addTools(new joint.dia.ToolsView({ tools: [new joint.linkTools.Remove({ distance: WFShape_RemoveDistance })] }));
        });
        this.paper.on('link:mouseenter', function (linkView) {
            linkView.showTools();
        });

        this.paper.on('link:mouseleave', function (linkView) {
            linkView.hideTools();
        });

        DiagramHelper._setLayoutDirection('LR', this.setState); // Set the default layout direction to be LR (Left->Right)
    } // componentDidMount
    render() {
        return (<div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={(event) => {
                        this.setState({ systemShowMenu: true, anchorEl: event.target })
                    }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" >
                        Google Cloud Workflows
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* This is the anchor element for the JointJS surface */}
            <div ref={el => this.el = el}></div>

            {/* Button at the bottom */}
            <Grid container justifyContent="flex-end">



                {
                    /*
                <Button color="primary" variant="contained" onClick={() => {
                    this.setState({ openLoad: true });
                }}>Load</Button>
                &nbsp;
                <Button color="primary" variant="contained" onClick={() => {
                    this.setState({ openSave: true, saveText: JSON.stringify(this.graph.toJSON(), null, 2) });
                    console.log(JSON.stringify(this.graph.toJSON(), null, 2));
                }}>Save</Button>
                &nbsp;
                */
                }
                <Button color="primary" variant="contained" onClick={() => DiagramHelper._layout(this.state.layout, this.graph)}>Auto Layout</Button>
                &nbsp;
                <Button color="primary" variant="contained" onClick={() => DiagramHelper._add(this.state.stepCount, this.paper, this.graph, this.setState) }>Add Step</Button>
                &nbsp;
                <Button color="primary" variant="contained" onClick={() => DiagramHelper._buildWF(this.graph, this.setState)}>Build YAML</Button>
                &nbsp;
            </Grid>


            {/* LOAD */}
            <Dialog open={this.state.openLoad} fullWidth>
                <p>Load</p>
                <input type='file' onChange={(event) => {
                    let file = event.target.files[0];
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        debugger;
                    });
                    reader.readAsText(file);
                    //debugger;
                }}></input>
                <Input type='text' value={this.state.loadText} multiline rows='12' onChange={(event) => {
                    this.setState({ loadText: event.target.value });
                }}></Input>
                <Button onClick={() => {
                    this.graph.fromJSON(JSON.parse(this.state.loadText));
                }}>Set JSON</Button>
                <Button onClick={() => {
                    this.setState({ openLoad: false });
                }}>Close</Button>
            </Dialog>

            {/* SAVE */}
            <Dialog open={this.state.openSave} fullWidth>
                <p>Save</p>
                <Input type='text' value={this.state.saveText} multiline rows='12' readOnly></Input>
                <Button onClick={() => {
                    this.setState({ openSave: false });
                }}>Close</Button>
            </Dialog>

            {/* Context Menu from step */}
            <Menu
                keepMounted
                anchorReference='anchorPosition'
                open={this.state.contextShowMenu}
                anchorPosition={{
                    top: this.state.mouse.y - 10, left: this.state.mouse.x - 10 // Subtract some from the x,y values so that the menu is not at the very edge.
                }}
                MenuListProps={{ onMouseLeave: () => DiagramHelper._menuClose(this.setState) }}
            >
                <MenuItem onClick={() => {
                    this.setState({ settingsShowDialog: true });
                }}>
                    Settings
                </MenuItem>
                <MenuItem onClick={() => DiagramHelper._duplicateElement(this.state.stepCount, this.paper, this.graph, this.setState, this.state.menuElement)}>Duplicate</MenuItem>
                <MenuItem onClick={() => DiagramHelper._deleteElement(this.state.menuElement, this.setState)}>Delete</MenuItem>
                
                <MenuItem onClick={() => DiagramHelper._dumpElement(this.state.menuElement)}>Dump</MenuItem>
            
            </Menu>

            {/* SETTINGS */}
            <SettingsDialog open={this.state.settingsShowDialog}
                wf={this.state.wf}
                onOk={() => DiagramHelper._settingsOk(this.state.wf, this.setState, this.state.menuElement)}
                onCancel={() => DiagramHelper._settingsCancel(this.state.wf, this.setState)}
            />
            <YAMLInputDialog open={this.state.yamlInputShowDialog}
                onOk={
                    (allYaml) => {
                        this.setState({ yamlInputShowDialog: false });
                        DiagramHelper._parseWF(allYaml, this.graph, this.paper, this.state.stepCount, this.setState)
                    }
                }
                onCancel={
                    () => {
                        this.setState({ yamlInputShowDialog: false });
                    }
                }
            />
            <YAMLOutputDialog open={this.state.yamlOutputShowDialog}
                onClose={() => { this.setState({ yamlOutputShowDialog: false }) }}
                text={this.state.yamlText}
            />

            <Menu
                id="menu-appbar"
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                MenuListProps={{ onMouseLeave: () => this.setState({ systemShowMenu: false }) }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={this.state.systemShowMenu}
                onClose={() => {
                    this.setState({ systemShowMenu: false });
                }}
            >
                <MenuItem onClick={() => DiagramHelper._layout(this.state.layout, this.graph)}>Layout</MenuItem>
                <MenuItem onClick={() => {
                    this.setState({ yamlInputShowDialog: true })
                }}>Input YAML</MenuItem>
                <Divider />
                <MenuItem onClick={() => this.setState({ aboutDialogOpen: true })}>About...</MenuItem>
            </Menu>



            <MessageDialog
                open={this.state.aboutDialogOpen}
                message={
                    <div>
                        <p>Workflow editor</p>
                        <p>Version: 2021-10-30</p>
                        <p>Email: kolban@google.com</p>
                    </div>
                }
                title="About ..."
                onClose={() => this.setState({ aboutDialogOpen: false })}
            />


        </div>);
    } // render
}

/*

*/
export default MyJointJS;