import * as React from 'react';
import { RouteComponentProps } from "react-router";
import axios from '../../utils/server';
import { Article } from "../../models/article";
import FullArticle from '../../components/FullArticle/FullArticle';
import FullComments from '../../components/FullComments/FullComments';
import { AxiosError, AxiosResponse } from "axios";
import { Skeleton } from "antd";

interface IState {
  article: Article | null;
  loading: boolean;
}

class ReadArticle extends React.Component<RouteComponentProps> {

  public state: IState = {
    article: null,
    loading: true,
  };

  public componentDidMount() {

    // @ts-ignore
    axios.get(`/articles/${this.props.match.params.article_id}`)
      .then((response: AxiosResponse<{ data: Article }>) => {
        console.log(response);
        this.setState({
          article: response.data.data,
          loading: false
        })
      });

  }

  public handleCommentSendFailure = (error: AxiosError) => {
    // this.props.history.push('/login');
    console.log(error);
  };

  public render() {

    const article = {...this.state.article} as Article;

    console.log('[Article]', article);

    const loading = this.state.loading;

    return (
      <div
        style={{
          margin: '20px auto',
          width: '70%',
          maxWidth: '900px'
        }}
      >
        <Skeleton
          loading={loading}
          active={true}
        >
          <FullArticle article={article}/>
        </Skeleton>
        <FullComments
          onCommentSendFailure={this.handleCommentSendFailure}
          article_id={(this.props.match.params as any).article_id}
        />
      </div>
    );
  }
}

export default ReadArticle;
