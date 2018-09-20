import * as React from 'react';
import { Avatar } from "antd";

interface IProps {
  avatarPath?: string
}

const safeAvatar = (props: IProps) => {

  return (
    <Avatar src={props.avatarPath} icon={props.avatarPath ? undefined : 'user'}/>
  );
};

export default safeAvatar;
