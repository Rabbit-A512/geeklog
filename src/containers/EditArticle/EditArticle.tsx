import * as React from 'react';
import { omit } from 'lodash';

import Editor from '../../components/Editor/Editor';
import { RouteComponentProps } from "react-router";
import { Article, EditingArticle } from "../../models/article";
import server, { getAuthServer } from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Icon } from "antd";

interface IState {
  article?: Article
}

class EditArticle extends React.Component<RouteComponentProps> {

  public state: IState = {
    article: undefined
  };

  public modifyArticle = (article: EditingArticle) => {
    const article_id = (this.props.match.params as any).article_id;
    const authServer = getAuthServer();

    const reqBody = omit(article, ['user_id']);
    console.log(reqBody);

    authServer.put(`/articles/${article_id}`, reqBody)
      .then((resWithModifiedArticle: AxiosResponse) => {
        if (resWithModifiedArticle.data.code === 200) {
          this.props.history.push(`/read-article/${article_id}`);
        } else {
          console.log(resWithModifiedArticle);
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    const article_id = (this.props.match.params as any).article_id;
    server.get(`/articles/${article_id}`)
      .then((res: AxiosResponse) => {
        const article = res.data.data || undefined;
        this.setState({
          article
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {

    const article = this.state.article;

    if (!article) {
      return <Icon type={'loading'} />;
    }

    return (
      <Editor
        onArticleChange={this.modifyArticle}
        category_id={article.category_id}
        tags={article.tags ? article.tags.split(',') : []}
        source={article.content}
        title={article.title}
      />
    );
  }
}

export default EditArticle;
