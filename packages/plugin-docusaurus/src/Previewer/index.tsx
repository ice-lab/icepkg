import React from 'react';
import PcPreview from './Pc';
import MobilePreview from './Mobile';

function Previewer({ mobilePreview, children, code, ...props }) {
  const deserializedCode = (code || '')
    .replace(/&#x60;/g, '`')
    .replace(/&#36;/g, '$');

  if (mobilePreview) {
    return <MobilePreview code={deserializedCode} {...props} />;
  } else {
    return <PcPreview
      code={deserializedCode}
      { ...props }
      >{ children }</PcPreview>;
  }
}

export default Previewer;
