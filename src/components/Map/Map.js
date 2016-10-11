import React from 'react';

import './Map.scss';

const Map = ({
  data = [],
  invariantParameters = []
}) => {
  return (
    <div>
      <h2>Map visualization</h2>
      <p>Invariant parameters:</p>
      <ul>
        {invariantParameters.map((parameter, key) =>
          (<li key={key}>{parameter.id} : {parameter.mappedField}</li>)
        )}
      </ul>
      <pre>
        Data: {JSON.stringify(data, null, 1)}
      </pre>
    </div>
  );
};

export default Map;
