//437-528


module.exports.DCRTASK = [
    {
        label: 'Task',
        actionName: 'replace-with-task',
        className: 'bpmn-icon-task',
        target: {
            type: 'bpmn:Task'
        }
    },
    {
        label: 'Dcr inc Task',
        actionName: 'replace-with-dcr-inc-task',
        className: 'bpmn-icon-send',
        target: {
            type: 'dcr:DcrTask'
        }
    },
    {
        label: 'Dcr exc Task',
        actionName: 'replace-with-dcr-exc-task',
        className: 'bpmn-icon-receive',
        target: {
            type: 'dcr:DcrTaskInc'
        }
    }
]


