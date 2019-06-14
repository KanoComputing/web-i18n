declare module 'acorn-walk' {
    import * as acorn from 'acorn';

    interface IVisitors {
        [K : string] : (node : acorn.Node) => void;
    }

    const base : any;
    function simple(program : acorn.Node, visitors : IVisitors, visitor : any) : any;
}
