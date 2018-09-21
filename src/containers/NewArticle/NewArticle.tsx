import * as React from 'react';

import Editor from '../../components/Editor/Editor';
import { EditingArticle } from "../../models/article";
import { getAuthServer } from "../../utils/server";
import { getCurrentUser } from "../../utils/auth";
import { AxiosError, AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router";

class NewArticle extends React.Component<RouteComponentProps> {

  public submitNewArticle = (article: EditingArticle) => {
    console.log(article);
    const authServer = getAuthServer();
    const currentUser = getCurrentUser();
    const reqBody = {
      ...article,
      user_id: currentUser.user_id
    };

    authServer.post('/articles', reqBody)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.props.history.push(`/read-article/${res.data.data.article_id}`)
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public render() {
    return (
      <Editor
        onArticleChange={this.submitNewArticle}
      />
    );
  }
}

export default NewArticle;
