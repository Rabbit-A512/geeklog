import * as React from 'react';
import { Comment } from "../../models/comment";
import { Card } from "antd";
import Avatar from "antd/lib/avatar";

const Meta = Card.Meta;

const commentCard = (props: Comment) => (
  <Card
    title={`user_id: ${props.user_id}`}
  >
    <Meta
      avatar={<Avatar icon={'user'}/>}
    />
  </Card>
);

export default commentCard;
