import * as React from 'react';
import { Article } from "../../models/article";
import { Card } from "antd";
import Avatar from "antd/lib/avatar";

const Meta = Card.Meta;

interface IArticleCardProps {
  article: Article;
}

const articleCard = (props: IArticleCardProps) => (
  <Card
    style={{
      width: '100%',
    }}
  >
    <Meta
      avatar={<Avatar icon={'user'}/>}
      title={props.article.title}
      description={props.article.content.length > 50 ? props.article.content.substr(0, 50) + '...' : props.article.content}
    />
    <p>{props.article.body}</p>
  </Card>
);

export default articleCard;
