import * as React from 'react';
import { RouteComponentProps } from "react-router";
import axios from '../../utils/myServer';
import { Article } from "../../models/article";
import FullArticle from '../../components/FullArticle/FullArticle';
import FullComments from '../../components/FullComments/FullComments';
import { AxiosResponse } from "axios";

class ReadArticle extends React.Component<RouteComponentProps> {

  public state: { article: Article | null, loading: boolean } = {
    article: null,
    loading: true
  };

  public componentDidMount() {


    // @ts-ignore
    axios.get(`/articles/${this.props.match.params.article_id}`)
      .then((response: AxiosResponse) => {
        console.log(response);
        this.setState({
          article: response.data.data,
          loading: false
        })
      });

  }

  public render() {

    const article = {...this.state.article};

    return (
      <div
        style={{
          margin: '20px auto',
          width: '70%',
          maxWidth: '900px'
        }}
      >
        <FullArticle article={article as Article}/>
        <FullComments article_id={(article as Article).article_id}/>
      </div>
    );
  }
}

export default ReadArticle;
