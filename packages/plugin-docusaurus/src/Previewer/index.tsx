import * as React from 'react';
import PCPreview from './PC';
import MobilePreview from './Mobile';

interface PreviewerProps {
  mobilePreview: boolean;
  url: string;
  code: string;
}

const Previewer: React.FunctionComponent<React.PropsWithChildren<PreviewerProps>> = ({
  mobilePreview,
  children,
  code,
  url,
}) => {
  const deserializedCode = (code || '')
    .replace(/&#x60;/g, '`')
    .replace(/&#36;/g, '$');

  if (mobilePreview) {
    return <MobilePreview code={deserializedCode} url={url} />;
  } else {
    return (
      <PCPreview code={deserializedCode}>
        {children}
      </PCPreview>
    );
  }
};

export default Previewer;
