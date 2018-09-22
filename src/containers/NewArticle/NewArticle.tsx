import * as React from 'react';

import Editor from '../../components/Editor/Editor';
import { EditingArticle } from "../../models/article";
import { getAuthServer } from "../../utils/server";
import { getCurrentUser } from "../../utils/auth";
import { AxiosError, AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router";
import server from "../../utils/server";

class NewArticle extends React.Component<RouteComponentProps> {

  public state = {
    can_write_article: true
  };

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

  public componentDidMount() {
    // set can_comment state field
    const currentUserId = getCurrentUser().user_id;
    server.get(`/users/${currentUserId}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            can_write_article: res.data.data.can_write_article
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {

    const editor = this.state.can_write_article ? (
      <Editor
        onArticleChange={this.submitNewArticle}
      />
    ) : (
      <p
        style={{
          fontSize: 'large',
          color: 'red'
        }}
      >
        您的写作权限已经被管理员冻结，请联系管理员QQ:2654525303申请解冻。
      </p>
    );

    return (
      <div>
        {editor}
      </div>
    );
  }
}

export default NewArticle;
