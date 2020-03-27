import React from 'react';
import { Progress } from 'reactstrap';

const ProgressExample = (props) => {
    return (
             <div>
                <h1>Bootstrap ProgressBar</h1>
                <div className="text-center">75%</div>
                <Progress value={75} />
             </div>
    );
};

export default ProgressExample;