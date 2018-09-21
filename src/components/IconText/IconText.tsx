import * as React from 'react';
import { Icon } from "antd";

interface IProps {
  type: string;
  text: string;
}

const iconText = (props: IProps) => (
  <span>
    <Icon
      type={props.type}
      style={{
        marginRight: '8px'
      }}
    />
    {props.text}
  </span>
);

export default iconText;
