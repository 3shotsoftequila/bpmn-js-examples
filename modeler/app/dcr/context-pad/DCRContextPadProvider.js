import {
    assign,
    forEach,
    isArray,
    every
} from 'min-dash';

import inherits from 'inherits-browser';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'

import {
    is
} from 'bpmn-js/lib/util/ModelUtil'

import {
    isExpanded,
    isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';

import {
isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
getChildLanes
} from 'bpmn-js/lib/features/modeling/util/LaneUtil';

import {
hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';

/**
 * A provider for BPMN 2.0 elements context pad
 */

export default class DcrContextPadProvider {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.contextPad = contextPad;
        //this.popupMenu = this.popupMenu;
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this);
    }
    getContextPadEntries(element) {
        
        const {
            autoPlace,
            create,
            elementFactory,
            translate,
            contextPad,
            //popupMenu
        } = this;

        var popupMenu = this.popupMenu;

        var businessObject = element.businessObject;


        function appendDcrTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'dcr:DcrTask' });
          
                autoPlace.append(element, shape);
              } else {
                appendDcrTaskStart(event, element);
              }
        }

        function startConnect(event, element) {
            connect.start(event, element);
        }
        

        function getReplaceMenuPosition(element) {
            var Y_OFFSET = 5;

            var pad = contextPad.getPad(element).html;

            var padRect = pad.getBoundingClientRect();

            var pos = {
            x: padRect.left,
            y: padRect.bottom + Y_OFFSET
            };

            return pos;
        }
        
        function appendDcrTaskStart(event) {
            const shape = elementFactory.createShape({ type: 'dcr:DcrTaskInc' });
        
            create.start(event, shape, element);

        }

        if (is(businessObject, 'dcr:DcrTask')) {

            return function (actions) {

                delete actions['append.end-event']
                delete actions['append.gateway']
                delete actions['append.intermediate-event']
                delete actions['append.text-annotation']
                delete actions['append.append-task']
                delete actions['replace']
                delete actions['connect']


                return {
                    ...actions,
                    'append-dcrtask': {
                        group: 'model',
                        className: 'bpmn-icon-start-event-non-interrupting-parallel-multiple',
                        title: translate('Append DcrTask'),
                        action: {
                        click: appendDcrTask,
                        dragstart: appendDcrTask
                        }
                    },

                    'append-dcrtaskinc': {
                        group: 'model',
                        className: 'bpmn-icon-lane-divide-two',
                        title: translate('Append DcrTaskinc'),
                        action: {
                        click: appendDcrTaskStart,
                        dragstart: appendDcrTaskStart
                        }
                    },

                    'append-connect': {
                        group: 'append',
                        className: 'bpmn-icon-connection',
                        title: translate('Connect using Custom Connector'),
                        action: {
                          click: startConnect,
                          dragstart: startConnect
                        }
                    },

                    'append-replace': {
                        group: 'edit',
                        className: 'bpmn-icon-screw-wrench',
                        title: translate('Change Event Type'),
                        action: {
                        click: function(event, element) {//appendDcrTaskStart

                            var position = assign(getReplaceMenuPosition(element), {
                                cursor: { x: event.x, y: event.y }
                            });

                            popupMenu.open(element, 'bpmn-replace', position, {
                                title: translate('Change element'),
                                width: 300,
                                search: true
                              });
                            }
                        }
                    },

                }
                    
            }
        }

        if (is(businessObject, 'dcr:DcrTaskInc')) {

            return function (actions) {

                delete actions['append.end-event']
                delete actions['append.gateway']
                delete actions['append.intermediate-event']
                delete actions['append.text-annotation']
                delete actions['append.append-task']
                delete actions['replace']
                delete actions['connect']




                return {
                    ...actions,
                    'append-dcrtask': {
                        group: 'model',
                        className: 'bpmn-icon-start-event-non-interrupting-parallel-multiple',
                        title: translate('Append DcrTask'),
                        action: {
                        click: appendDcrTask,
                        dragstart: appendDcrTask
                        }
                    },

                    'append-dcrtaskinc': {
                        group: 'model',
                        className: 'bpmn-icon-lane-divide-two',
                        title: translate('Append DcrTaskinc'),
                        action: {
                        click: appendDcrTaskStart,
                        dragstart: appendDcrTaskStart
                        }
                    },

                    'append-replace': {
                        group: 'edit',
                        className: 'bpmn-icon-screw-wrench',
                        title: translate('Change Event Type'),
                        action: {
                        click: function(event, element) {//appendDcrTaskStart

                            var position = assign(getReplaceMenuPosition(element), {
                                cursor: { x: event.x, y: event.y }
                            });

                            popupMenu.open(element, '', position, {
                                title: translate('Change element'),
                                width: 300,
                                search: true
                              });
                            }
                        }
                    },

                    'append-connect': {
                        group: 'append',
                        className: 'bpmn-icon-connection',
                        title: translate('Connect using Custom Connector'),
                        action: {
                          click: startConnect,
                          dragstart: startConnect
                        }
                    },

                }
                    
            }
        }

        else {
            return {} 
         }
            
    };
}


DcrContextPadProvider.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate',
    //'eventBus',
    //'modeling',
    //'connect',
    'popupMenu',
    //'canvas',
    //'rules',
];










