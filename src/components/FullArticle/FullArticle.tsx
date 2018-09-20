import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card } from "antd";
import * as ReactMarkdown from 'react-markdown';
import CodeBlock from "../CodeBlock/CodeBlock";
import { getAuthServer } from "../../utils/server";
import { RouteComponentProps, withRouter } from "react-router";
import { getCurrentUser } from "../../utils/auth";
import { AxiosError, AxiosResponse } from "axios";

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
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    //
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

    return (
      <Card
        title={(
          <h2
            style={{
              textAlign: 'center'
            }}
          >{this.props.article.title}</h2>
        )}
      >
        <ReactMarkdown
          source={this.props.article.content}
          renderers={{
            code: CodeBlock
          }}
        />
        <Meta
          description={(
            <ButtonGroup
              style={{
                marginLeft: 'auto'
              }}
            >
              {collectBtn}
              {likeBtn}
            </ButtonGroup>
          )}
          style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        />
      </Card>
    );
  }
}

export default withRouter(FullArticle);
