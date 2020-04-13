import React from 'react';
import { Component } from 'react';

//Our components will be custom Components, extending React.Component class:
class AClassBasedComponent extends Component {

    //Inside this class, inside any class method, the passed-in props 
    // are accessible as:   this.props

   //Every component you write must at least have a render() method:
   render() {

       //define a constant, get the passed-in revenue value prop...or the default value of zero:
       const msgPrefix = "YTD Revenue: $";
       let revenue = (this.props.revenue || "0.00");

       //here is one example way to style a component, in addition to using CSS style sheets
       const inlineStyleObj = {
           color: 'red',
           backgroundColor: 'white',
           fontWeight: 'bold',
           padding: '10px 5px 10px 5px'
       };

       //then, it must return some JSX:
       //here, we style the div inline, and we display the string-concatenation of our 2 local vars
       return (
                 <div style={inlineStyleObj}>
                     <h2>{msgPrefix + revenue}</h2>
                 </div>
       );
   }

}
///dont forget this export line
export default AClassBasedComponent;
