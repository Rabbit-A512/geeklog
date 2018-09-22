import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card, Popconfirm } from "antd";
import Avatar from "antd/lib/avatar";
import { getCurrentUser } from "../../utils/auth";
import { Link } from "react-router-dom";
import IconText from '../IconText/IconText';
import TagRenderer from '../TagRenderer/TagRenderer';

const Meta = Card.Meta;
const Group = Button.Group;

interface IArticleCardProps {
  article: Article;
}

const articleCard = (props: IArticleCardProps) => {

  const article = props.article;
  const currentUser = getCurrentUser();

  const canEdit = currentUser && article.user_id === currentUser.user_id;

  const editBtn = canEdit ? (
    <Link to={`/feature/edit-article/${article.article_id}`}>
      <Button
        htmlType={'button'}
        icon={'edit'}
      >
        编辑
      </Button>
    </Link>
  ) : null;

  const deleteBtn = canEdit ? (
    <Popconfirm
      title={'删除文章同时会删除所有相关评论，该操作无法撤销！'}
      okText={'确认删除'}
      cancelText={'取消'}
    >
      <Button
        htmlType={'button'}
        icon={'delete'}
        type={'danger'}
      >
        删除
      </Button>
    </Popconfirm>
  ) : null;

  const extra = (
    <Group>
      <Link to={`/read-article/${article.article_id}`}>
        <Button
          icon={'eye'}
          htmlType={'button'}
        >
          阅读
        </Button>
      </Link>
      {editBtn}
      {deleteBtn}
    </Group>
  );

  return (
    <Card
      className={'w-100'}
      extra={extra}
      title={(
        <span
          style={{ color: '#7ed4ff' }}
        >类别：{article.category_name}</span>
      )}
      actions={[
        <IconText
          key={0}
          type={'star-o'}
          text={`${article.collect_count}`}
        />,
        <IconText
          key={1}
          type={'like-o'}
          text={`${article.star_count}`}
        />,
        <IconText
          key={2}
          type={'message-o'}
          text={`${article.comment_count}`}
        />,
      ]}
    >
      <Meta
        avatar={<Avatar icon={'user'}/>}
        title={article.title}
        description={(
          <TagRenderer
            tags={article.tags}
          />
        )}
      />
    </Card>
  );
};

export default articleCard;
