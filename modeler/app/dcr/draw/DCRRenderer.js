import inherits from 'inherits-browser';

import {
  isObject,
  assign,
  forEach
} from 'min-dash';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import TextUtil from 'diagram-js/lib/util/Text';

import LabelUtil from 'bpmn-js/lib/util/LabelUtil';

import { is } from 'bpmn-js/lib/util/ModelUtil';
/*
import {
    isExpanded,
    isEventSubProcess
  } from '../util/DiUtil';
  
  import {
    getLabel
} from '../features/label-editing/LabelUtil';
  */  
import {
    createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
    isTypedEvent,
    isThrowEvent,
    isCollection,
    getDi,
    getSemantic,
    getCirclePath,
    getRoundRectPath,
    getDiamondPath,
    getRectPath,
    getFillColor,
    getStrokeColor,
    getLabelColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    query as domQuery
} from 'min-dom';
    
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses
} from 'tiny-svg';

import {
    rotate,
    transform,
    translate
} from 'diagram-js/lib/util/SvgTransformUtil';
  
import Ids from 'ids';

import { black } from 'bpmn-js/lib/draw/BpmnRenderUtil';


//add the var declarations here later

var TASK_BORDER_RADIUS = 10;

var LABEL_STYLE = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 12
};


export default function DcrRenderer(
    eventBus, styles, pathMap, priority) {
    
    BaseRenderer.call(this, eventBus, 1500);

    var textUtil = new TextUtil({
        style: LABEL_STYLE,
        size: {width: 100}
    });

    var computeStyle = styles.computeStyle;

    var markers = {};

    function shapeStyle(attrs) {
        return styles.computeStyle(attrs, {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: black,
            strokeWidth: 2,
            fill: 'white'
        });
    }

    function lineStyle(attrs) {
        return styles.computeStyle(attrs, [ 'no-fill' ], {
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          stroke: black,
          strokeWidth: 2
        });
    }

    function addMarker(id, options) {
        var {
          ref = { x: 0, y: 0 },
          scale = 1,
          element
        } = options;
    
        var marker = svgCreate('marker', {
          id: id,
          viewBox: '0 0 20 15',
          refX: ref.x,
          refY: ref.y,
          markerWidth: 20 * scale,
          markerHeight: 20 * scale,
          orient: 'auto'
        });

        svgAppend(marker, element);

        var defs = domQuery('defs', canvas._svg);

        if (!defs) {
            defs = svgCreate('defs');

            svgAppend(canvas._svg, defs);
        }

        svgAppend(defs, marker);

        markers[id] = marker;
    }

    //153-289
    function colorEscape(str) {

        // only allow characters and numbers
        return str.replace(/[^0-9a-zA-z]+/g, '_');
    }

    function marker(type, fill, stroke) {
        var id = type + '-' + colorEscape(fill) + '-' + colorEscape(stroke) + '-' + rendererId;
    
        if (!markers[id]) {
          createMarker(id, type, fill, stroke);
        }
    
        return 'url(#' + id + ')';
    }

    function createMarker(id, type, fill, stroke) {

        if (type === 'includeflow-end') {
            var includeflowEnd = svgCreate( 'path', {
                d: 'M 1 5 L 11 10 L 1 15 Z',
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: includeflowEnd,
                ref: { x: 11, y: 10 },
                scale: 0.5
            });
            
        } 

        if (type === 'excludeflow-end') {
            var excludeflowEnd = svgCreate( 'path', {
                d: 'M 1 5 L 11 10 L 1 15 Z',
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: excludeflowEnd,
                ref: { x: 11, y: 10 },
                scale: 0.5
            });
            
        } 

        if (type === 'responseflow-end') {
            var responseflowEnd = svgCreate( 'path', {
                d: 'M 1 5 L 11 10 L 1 15 Z',
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: responseflowEnd,
                ref: { x: 11, y: 10 },
                scale: 0.5
            });
            
        } 

        if (type === 'preconditionflow-end') {
            var preconditionflowEnd = svgCreate( 'path', {
                d: 'M 1 5 L 11 10 L 1 15 Z',
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: preconditionflowEnd,
                ref: { x: 11, y: 10 },
                scale: 0.5
            });
            
        } 

        if (type === 'circle-end') {
            var circleEnd = svgCreate( 'path', {
                d: "M 14.00,7.50 C 14.00,11.64 10.87,15.00 7.00,15.00 3.13,15.00 0.00,11.64 0.00,7.50 0.00,3.36 3.13,0.00 7.00,0.00 10.87,0.00 14.00,3.36 14.00,7.50 Z",
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: circleEnd,
                ref: { x: -1, y: 10 },
                scale: 0.5
            });
            
        } 
    }

    function drawLine(parentGfx, waypoints, attrs, radius) {
        attrs = lineStyle(attrs);
    
        var line = createLine(waypoints, attrs, radius);
    
        svgAppend(parentGfx, line);
    
        return line;
    }

    /**
     * @param {SVGElement} parentGfx
     * @param {Point[]} waypoints
     * @param {any} attrs
     *
     * @return {SVGElement}
     */
    function drawConnectionSegments(parentGfx, waypoints, attrs) {
      return drawLine(parentGfx, waypoints, attrs, 5);
    }
  
    function drawPath(parentGfx, d, attrs) {
  
      attrs = lineStyle(attrs);
  
      var path = svgCreate('path', {
        ...attrs,
        d
      });
  
      svgAppend(parentGfx, path);
  
      return path;
    }

    //look at below again

    function drawMarker(type, parentGfx, path, attrs) {
        return drawPath(parentGfx, path, assign({ 'data-marker': type }, attrs));
    }


    //function renderEventContent   (mostly used in Bpmn Event (s) - check the BmnRenderer 4 proper understanding)
    //432

    //Look from here=e way 4ward


    //155  note to self

    function drawRect(parentGfx, width, height, r, offset, attrs) {

        if (isObject(offset)) {
            attrs = offset;
            offset = 0;
          }
      
          offset = offset || 0;
      
          attrs = computeStyle(attrs, {
            stroke: black,
            strokeWidth: 2,
            fill: 'white'
        });
        
        var rect = svgCreate('rect');

        svgAttr(rect, {
            x: offset,
            y: offset,
            width: width - offset * 2,
            height: height - offset * 2,
            rx: r,
            ry: r
        });

        svgAttr(rect, attrs);

        svgAppend(parentGfx, rect);

        return rect;
    }

    function getHeaderSize(element) {
        return {width: element.width, height: 30}
    }

    function drawRectWithHeader(parentGfx, width, height, r, attrs) {
        var size = getHeaderSize({width: width, height: height});
        var headerRect = drawRect(parentGfx, size.width, size.height, TASK_BORDER_RADIUS, 0, attrs.header);

        var rect = svgCreate('rect');
        svgAttr(rect, {
            x: 0,
            y: 25,
            width: width,
            height: height - 25
        });
        svgAttr(rect, attrs.body);

        svgAppend(parentGfx, rect);

        return headerRect;
    }

    function drawLine(parentGfx, waypoints, attrs) {

        attrs = computeStyle(attrs, [ 'no-fill' ], {
          stroke: black,
          strokeWidth: 2,
          fill: 'none'
        });
    
        var line = createLine(waypoints, attrs);
    
        svgAppend(parentGfx, line);
    
        return line;
    }

    function drawPath(parentGfx, d, attrs) {

        attrs = computeStyle(attrs, ['no-fill'], {
            strokeWidth: 2,
            stroke: 'black'
        });

        var path = svgCreate('path');
        svgAttr(path, {d: d});
        svgAttr(path, attrs);

        svgAppend(parentGfx, path);

        return path;
    }

    function renderer(type) {
        return handlers[type];
    }

    function as(type) {
      return function(parentGfx, element) {
        return renderer(type)(parentGfx, element);
      };
    }

    

    //function renderLabel

    function renderLabel(parentGfx, label, options) {
        var text = textUtil.createText(parentGfx, label || '', options);
        svgClasses(text).add('djs-label');

        return text;
    }

    //function renderEmbeddedLabel

    function renderEmbeddedLabel(parentGfx, element, align, attr) {
        attr = assign({box: element, align: align, padding: 5},
            attr);

        var semantic = getSemantic(element);
        return renderLabel(parentGfx, semantic.name, attr);
    }

    //function renderExternalLabel

    function renderExternalLabel(parentGfx, element) {
        var semantic = getSemantic(element);
        var box = {
            width: 90,
            height: 30,
            x: element.width / 2 + element.x,
            y: element.height / 2 + element.y
        };


        return renderLabel(parentGfx, semantic.name, {box: box, style: {fontSize: '11px'}, align: 'center-bottom'});
    }
    
    //function renderLaneLabel

    //574 852

    var handlers = this.handlers = {

        'label': function (parentGfx, element) {
            // Update external label size and bounds during rendering when
            // we have the actual rendered bounds anyway.

            var textElement = renderExternalLabel(parentGfx, element);

            var textBBox;

            try {
                textBBox = textElement.getBBox();
            } catch (e) {
                textBBox = {width: 0, height: 0, x: 0};
            }

            // update element.x so that the layouted text is still
            // center alligned (newX = oldMidX - newWidth / 2)
            element.x = Math.ceil(element.x + element.width / 2) - Math.ceil((textBBox.width / 2));

            // take element width, height from actual bounds
            element.width = Math.ceil(textBBox.width);
            element.height = Math.ceil(textBBox.height);

            // compensate bounding box x
            svgAttr(textElement, {
                transform: 'translate(' + (-1 * textBBox.x) + ',0)'
            });

            return textElement;
        },


        'dcr:DcrTask': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 100;
            }
            if (element.height < 250) {
                element.height = 140;
            }

            var strokeWidth = 1.5;

            var attrs = {
                fill: '#e1ebf7',
                stroke: 'black',
                strokeWidth
            };

            var lane = renderer('dcr:Lane')(parentGfx, element, attrs);

            drawLine(parentGfx, [
                { x: 0,y: 30 },
                { x: element.width, y: 30 }
            ], {
                stroke: 'black',
                strokeWidth
            });

            var text = getSemantic(element).name;
            //renderLaneLabel(parentGfx, text, element);

            return lane;

        },

        'dcr:Lane': function(parentGfx, element, attrs) {
            var rect = drawRect(parentGfx, element.width, element.height, 5, {
              fill: 'e1ebf7',
              //fillOpacity: HIGH_FILL_OPACITY,
              stroke: 'black',
              strokeWidth: 1.5,
              ...attrs
            });
      
            var semantic = getSemantic(element);
      
            if (semantic.$type === 'dcr:Lane') {
              var text = semantic.name;
              renderEmbeddedLabel(parentGfx, text, element);
            }
      
            return rect;
        },

        'dcr:DcrTaskInc': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 100;
            }
            if (element.height < 250) {
                element.height = 140;
            }


            var strokeWidth = 1.5;

            var attrs = {
                fill: '#e1ebf7',
                stroke: 'black',
                strokeWidth,
                strokeDasharray: '12 5'
            };

            var lane = renderer('dcr:Lane')(parentGfx, element, attrs);

            drawLine(parentGfx, [
                { x: 0,y: 30 },
                { x: element.width, y: 30 }
            ], {
                stroke: 'black',
                strokeWidth,
                strokeDasharray: '12 5'
            });

            return lane;
 

        },

        'dcr:DcrSubProcesses': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 100;
            }
            if (element.height < 250) {
                element.height = 140;
            }

            var elementObject = drawRectWithHeader(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, {
                header: {
                    fill: "#e1ebf7", //"white",
                    stroke: 'black',
                    //border
                }, body: {fill: "#e1ebf7" /*"white"*/, stroke: 'black'}
            });

            return elementObject; //strokeDasharray: '12 5'
        },

        //look at = flows start here

        'dcr:IncludeFlow': function(parentGfx, element) {
            var fill = 'green',
                stroke = 'green';
      
            var path = drawConnectionSegments(parentGfx, element.waypoints, {
              markerStart: marker('circle-end', fill, stroke),
              markerEnd: marker('includeflow-end', fill, stroke),
              stroke: 'green'
            });
      
            return path;
        },

        'dcr:ExcludeFlow': function(parentGfx, element) {
            var fill = 'red',
                stroke = 'red';
    
            var path = drawConnectionSegments(parentGfx, element.waypoints, {
            markerStart: marker('circle-end', fill, stroke),
            markerEnd: marker('excludeflow-end', fill, stroke),
            stroke: 'red'
            });
    
            return path;
        },

        'dcr:ResponseFlow': function(parentGfx, element) {
            var fill = 'blue',
                stroke = 'blue';
    
            var path = drawConnectionSegments(parentGfx, element.waypoints, {
            markerStart: marker('circle-end', fill, stroke),
            markerEnd: marker('responseflow-end', fill, stroke),
            stroke: 'blue'
            });
    
            return path;
        },

        'dcr:PreconditionFlow': function(parentGfx, element) {
            var fill = 'yellow',
                stroke = 'yellow';
    
            var path = drawConnectionSegments(parentGfx, element.waypoints, {
            markerEnd: marker('preconditionflow-end', fill, stroke),
            stroke: 'yellow'
            });
    
            return path;
        },

    }

    this.canRender = function (element) {
        return this.handlers[element.type] != undefined;
    };

    this.drawShape = function (parent, element) {

        if (this.canRender(element)) {
            var handler = this.handlers[element.type];

            if (handler instanceof Function) {
                return handler(parent, element);
            }
        }

        return false;
    };

    this.drawConnection = function (parent, element) {}

    //Complete this = this.drawfunction () {}
}

inherits(DcrRenderer, BaseRenderer);

DcrRenderer.$inject = [
    'eventBus',
    'styles',
    'pathMap',
    //'textRenderer'
];

/*
BpmnRenderer.prototype.canRender = function(element) {
    return is(element, 'bpmn:BaseElement');
  };
  
BpmnRenderer.prototype.drawShape = function(parentGfx, element) {
    var type = element.type;
    var h = this._renderer(type);
  
    /* jshint -W040 *//*
    return h(parentGfx, element);
};
*/

