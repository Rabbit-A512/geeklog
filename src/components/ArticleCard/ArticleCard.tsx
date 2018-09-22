import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card, Popconfirm } from "antd";
import { getCurrentUser } from "../../utils/auth";
import { Link } from "react-router-dom";
import IconText from '../IconText/IconText';
import TagRenderer from '../TagRenderer/TagRenderer';
import { format } from 'date-fns';
import * as zh_CN from 'date-fns/locale/zh_cn/index.js';
import SafeAvatar from '../SafeAvatar/SafeAvatar';
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";

const Meta = Card.Meta;
const Group = Button.Group;

interface IArticleCardProps {
  article: Article;
  onDeleteConfirm?: any;
}

class ArticleCard extends React.Component<IArticleCardProps> {

  public state = {
    avatar: ''
  };

  public componentDidMount() {
    // set avatar path
    server.get(`/users/${this.props.article.user_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            avatar: res.data.data.avatar
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {
    const article = this.props.article;
    const currentUser = getCurrentUser();
    const canEdit = currentUser && article.user_id === currentUser.user_id;
    const showDeleteBtn = !!this.props.onDeleteConfirm;

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

    const deleteBtn = (canEdit && showDeleteBtn) ? (
      <Popconfirm
        title={'删除文章同时会删除所有相关评论，该操作无法撤销！'}
        okText={'确认删除'}
        cancelText={'取消'}
        onConfirm={() => this.props.onDeleteConfirm(this.props.article.article_id)}
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
          avatar={(
            <Link to={`/user-home/${article.user_id}`}>
              <div>
                <SafeAvatar
                  avatarPath={this.state.avatar}
                  size={'large'}
                />
              </div>
            </Link>
          )}
          title={(
            <div>
              <h3>{article.title}</h3>
              <div
                style={{
                  color: '#666'
                }}
              >作者：<Link to={`/user-home/${article.user_id}`}>{article.nickname}</Link></div>
            </div>
          )}
          description={(
            <div>
              <TagRenderer
                tags={article.tags}
              />
              <p>{article.content.length > 100 ? article.content.substr(0, 100) + '...' : article.content}</p>
              <div>发布于：{format(article.created_at, 'YYYY年 MMMM Do, HH:mm:ss', {locale: zh_CN})}</div>
              <div>编辑于：{format(article.modified_at, 'YYYY年 MMMM Do, HH:mm:ss', {locale: zh_CN})}</div>
            </div>
          )}
        />
      </Card>
    );
  }
}

export default ArticleCard;
