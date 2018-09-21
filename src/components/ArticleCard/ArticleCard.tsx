import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card } from "antd";
import Avatar from "antd/lib/avatar";
import { getCurrentUser } from "../../utils/auth";
import { Link } from "react-router-dom";

const Meta = Card.Meta;

interface IArticleCardProps {
  article: Article;
}

const articleCard = (props: IArticleCardProps) => {

  const article = props.article;
  const currentUser = getCurrentUser();

  const canEdit = currentUser && article.user_id === currentUser.user_id;

  return (
    <Card
      style={{
        width: '100%',
      }}
      extra={canEdit ? (
        <Link to={`/feature/edit-article/${article.article_id}`}>
          <Button htmlType={'button'} icon={'edit'}>编辑</Button>
        </Link>
      ) : null}
    >
      <Meta
        avatar={<Avatar icon={'user'}/>}
        title={article.title}
        description={article.content.length >20 ? article.content.substr(0, 20) + '...' : article.content}
      />
      <Link to={`/read-article/${article.article_id}`}>阅读全文</Link>
    </Card>
  );
};

export default articleCard;
