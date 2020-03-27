import React from 'react';
import { Component } from 'react';

//Our components will be custom Components, extending React.Component class:
class AClassBasedComponent extends Component {


   //Every component you write must at least have a render() method:
   render() {
       //it may do some presentation logic and setup here....
       const msg = "Hello from example class-based Component";

       //here is one example way to style a component, in addition to using CSS style sheets
       const inlineStyleObj = {
           color: 'red',
           backgroundColor: 'white',
           fontWeight: 'bold',
           padding: '10px 5px 10px 5px'
       };

       //then, it must return some JSX
       return (
                 <div style={inlineStyleObj}>
                     <h2>{msg}</h2>
                 </div>
       );
   }

}

export default AClassBasedComponent;
///dont forget this export line