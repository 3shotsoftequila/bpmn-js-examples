import DcrReplaceMenuProvider from "./DCRReplaceMenuProvider";
//import ReplaceModule from 'diagram-js/lib/features/replace';
//import PopupMenuModule from 'diagram-js/lib/features/popup-menu';


export default {/*
    __depends__: [
        ReplaceModule,
        PopupMenuModule
    ],*/

    __init__: [ 'dcrReplaceMenuProvider' ],
    dcrReplaceMenuProvider: [ 'type', DcrReplaceMenuProvider ]
};