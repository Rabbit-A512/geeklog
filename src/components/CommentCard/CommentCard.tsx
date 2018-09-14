import * as React from 'react';
import { FakeComment } from "../../models/comment";
import { Card } from "antd";
import Avatar from "antd/lib/avatar";

const Meta = Card.Meta;

const commentCard = (props: FakeComment) => (
  <Card
    title={props.name}
  >
    <Meta
      avatar={<Avatar icon={'user'}/>}
    />
  </Card>
);

export default commentCard;
