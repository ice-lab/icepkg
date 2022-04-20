import React from 'react';
import PcPreview from './Pc';
import MobilePreview from './Mobile';

function Previewer({ mobilePreview, children, ...props }) {
  console.log('fsfd', mobilePreview);
  if (mobilePreview) {
    return <MobilePreview {...props} />;
  } else {
    return <PcPreview
      { ...props }
      >{ children }</PcPreview>;
  }
}

export default Previewer;
