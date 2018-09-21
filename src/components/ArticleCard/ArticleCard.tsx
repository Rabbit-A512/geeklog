import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card, Tag } from "antd";
import Avatar from "antd/lib/avatar";
import { getCurrentUser } from "../../utils/auth";
import { Link } from "react-router-dom";
import IconText from '../IconText/IconText';
import tagColors from '../../utils/tagColors';

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
          <span>
            {article.tags.split(',').map((value: string, index: number) => {
              return (
                <Tag
                  color={tagColors[index % 11]}
                  key={value}
                >
                  {value}
                </Tag>
              );
            })}
          </span>
        )}
      />
    </Card>
  );
};

export default articleCard;
