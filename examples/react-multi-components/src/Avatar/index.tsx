import * as React from 'react';
import defaultAvatar from './default.png';
import './index.css';
import '../styles/common.css';

interface AvatarProps {

}

const Avatar: React.FunctionComponent<React.PropsWithChildren<AvatarProps>> = (props) => {
  return (
    <img src={defaultAvatar} alt="avatar" className="pkg-avatar" />
  );
};

export default Avatar;
