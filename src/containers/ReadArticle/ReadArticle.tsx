import * as React from 'react';
import { RouteComponentProps } from "react-router";
import axios from 'axios';
import { FakeArticle } from "../../models/article";
import FullArticle from '../../components/FullArticle/FullArticle';

class ReadArticle extends React.Component<RouteComponentProps> {

  public state: { article: FakeArticle | null, loading: boolean } = {
    article: null,
    loading: true
  };

  public componentDidMount() {
    // @ts-ignore
    axios.get(`http://jsonplaceholder.typicode.com/posts/${this.props.match.params.id}`)
      .then((response: {data: FakeArticle}) => {
        this.setState({
          article: response.data,
          loading: false
        })
      });
  }

  public render() {

    const article = {...this.state.article};

    return (
      <div>
        <FullArticle article={article as FakeArticle}/>
      </div>
    );
  }
}

export default ReadArticle;
