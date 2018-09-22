import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card, Divider } from "antd";
import * as ReactMarkdown from 'react-markdown';
import CodeBlock from "../CodeBlock/CodeBlock";
import server, { getAuthServer } from "../../utils/server";
import { RouteComponentProps, withRouter } from "react-router";
import { getCurrentUser } from "../../utils/auth";
import { AxiosError, AxiosResponse } from "axios";
import TagRenderer from '../TagRenderer/TagRenderer';
import { format } from "date-fns";
import * as zh_CN from "date-fns/locale/zh_cn/index.js";
import { Link } from "react-router-dom";

const Meta = Card.Meta;
const ButtonGroup = Button.Group;

interface IState {
  starred: boolean;
  collected: boolean
}

interface IProps extends RouteComponentProps {
  article: Article
}

class FullArticle extends React.Component<IProps> {

  public state: IState = {
    starred: false,
    collected: false
  };

  public handleAddStar = () => {
    const authServer = getAuthServer();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.push('/login');
    }

    const reqBody = {
      user_id: currentUser.user_id,
      article_id: this.props.article.article_id
    };

    authServer.post('/add-star', reqBody)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.loadStarCollectStatus();
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public handleAddCollect = () => {
    const authServer = getAuthServer();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.push('/login');
    }

    const reqBody = {
      user_id: currentUser.user_id,
      article_id: this.props.article.article_id
    };

    authServer.post('/add-collect', reqBody)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.loadStarCollectStatus();
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public handleDeleteStar = () => {
    const authServer = getAuthServer();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.push('/login');
    }

    const reqBody = {
      user_id: currentUser.user_id,
      article_id: this.props.article.article_id
    };

    authServer.post('/delete-star', reqBody)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.loadStarCollectStatus();
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public handleDeleteCollect = () => {
    const authServer = getAuthServer();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.push('/login');
    }

    const reqBody = {
      user_id: currentUser.user_id,
      article_id: this.props.article.article_id
    };

    authServer.post('/delete-collect', reqBody)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.loadStarCollectStatus();
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public loadStarCollectStatus = () => {
    const currentUser = getCurrentUser();
    server.get(`/is-starred/${currentUser.user_id}/${this.props.article.article_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            starred: res.data.data
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });

    server.get(`/is-collected/${currentUser.user_id}/${this.props.article.article_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            collected: res.data.data
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    this.loadStarCollectStatus();
  }

  public render() {

    const likeBtn = this.state.starred ?
      (
        <Button
          type={'primary'}
          htmlType={'button'}
          icon={'like'}
          onClick={this.handleDeleteStar}
        >
          已点赞
        </Button>
      ) :
      (
        <Button
          htmlType={'button'}
          icon={'like'}
          onClick={this.handleAddStar}
        >
          点赞
        </Button>
      );

    const collectBtn = this.state.collected ?
      (
        <Button
          type={'primary'}
          htmlType={'button'}
          icon={'star'}
          onClick={this.handleDeleteCollect}
        >
          已收藏
        </Button>
      ) :
      (
        <Button
          htmlType={'button'}
          icon={'star'}
          onClick={this.handleAddCollect}
        >
          收藏
        </Button>
      );

    const articleBody = this.props.article.display ? (
      <ReactMarkdown
        source={this.props.article.content}
        renderers={{
          code: CodeBlock
        }}
      />
    ) : (
      <p
        style={{
          fontSize: 'large',
          color: 'red'
        }}
      >
        您的文章涉嫌违规，已被管理员屏蔽。请联系管理员QQ:2654525303并根据要求编辑文章内容。
      </p>
    );

    return (
      <Card
        title={(
          <div>
            <div
              style={{
                textAlign: 'center'
              }}
            >
              <h2>{this.props.article.title}</h2>
              <p>
                <span>作者：</span>
                <Link to={`/user-home/${this.props.article.article_id}`}>
                  {this.props.article.nickname}
                </Link>
              </p>
            </div>
            <TagRenderer
              tags={this.props.article.tags}
            />
          </div>
        )}
      >
        {articleBody}
        <Meta
          description={(
            <div>
              <Divider/>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <div>
                  <div>发布于：{format(this.props.article.created_at, 'YYYY年 M月Do日, HH:mm:ss', {locale: zh_CN})}</div>
                  <div>编辑于：{format(this.props.article.modified_at, 'YYYY年 M月Do日, HH:mm:ss', {locale: zh_CN})}</div>
                </div>
                <ButtonGroup
                  style={{
                    marginLeft: 'auto'
                  }}
                >
                  {collectBtn}
                  {likeBtn}
                </ButtonGroup>
              </div>
            </div>
          )}
        />
      </Card>
    );
  }
}

export default withRouter(FullArticle);
