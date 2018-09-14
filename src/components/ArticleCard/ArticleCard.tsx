import * as React from 'react';
import { FakeArticle } from "../../models/article";
import { Card } from "antd";
import Avatar from "antd/lib/avatar";

const Meta = Card.Meta;

interface IArticleCardProps {
  article: FakeArticle;
}

const articleCard = (props: IArticleCardProps) => (
  <Card
    style={{
      width: '100%',
    }}
  >
    <Meta
      avatar={<Avatar icon={'user'}/>}
      title={props.article.title.length > 30 ? props.article.title.substr(0, 30) + '...' : props.article.title}
      description={props.article.userId}
    />
    <p>{props.article.body}</p>
  </Card>
);

export default articleCard;
