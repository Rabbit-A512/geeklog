import * as React from 'react';
import { Tag } from "antd";
import tagColors from "../../utils/tagColors";

interface IProps {
  tags: string;
}

const tagRenderer = (props: IProps) => (
  <span>
    {props.tags ? props.tags.split(',').map((value: string, index: number) => {
      return (
        <Tag
          color={tagColors[index % 11]}
          key={value}
        >
          {value}
        </Tag>
      );
    }) : null}
  </span>
);

export default tagRenderer;
