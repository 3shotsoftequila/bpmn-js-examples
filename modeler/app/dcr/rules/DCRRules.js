import {
    every,
    find,
    forEach,
    some
} from 'min-dash';

import inherits from 'inherits-browser';

import {
    is,
    getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
    getParent,
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';


export default function DcrRules(eventBus) {
    RuleProvider.call(this, eventBus);
}
  
inherits(DcrRules, RuleProvider)
  
DcrRules.$inject = ['eventBus'];
  
DcrRules.prototype.init = function() {}