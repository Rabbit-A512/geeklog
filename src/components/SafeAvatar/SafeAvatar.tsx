import * as React from 'react';
import { Avatar } from "antd";

interface IProps {
  avatarPath?: string;
  size: number | 'small' | 'default' | 'large';
}

const safeAvatar = (props: IProps) => {

  return (
    <Avatar
      size={props.size}
      src={props.avatarPath}
      icon={props.avatarPath ? undefined : 'user'}/>
  );
};

export default safeAvatar;
