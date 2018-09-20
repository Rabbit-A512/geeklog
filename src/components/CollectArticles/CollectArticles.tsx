import * as React from 'react';
import { List } from "antd";
import { Article } from "../../models/article";
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Link } from "react-router-dom";

import ArticleCard from '../../components/ArticleCard/ArticleCard';

interface IProps {
  user_id: number;
}

class CollectArticles extends React.Component<IProps> {

  public state = {
    articles: Array<Article>(),
    page: 1,
    size: 10
  };

  public loadArticles = (page: number) => {
    server.get(`/users/${this.props.user_id}/collect/articles?page=${page}&size=${this.state.size}`)
      .then((res: AxiosResponse) => {
        const articles = res.data.data ? res.data.data.entities : [];
        this.setState({
          articles
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    this.loadArticles(1);
  }

  public render() {
    return (
      <div
        style={{
          width: '100%'
        }}
      >
        <List
          dataSource={this.state.articles}
          renderItem={(item: Article) => (
            <List.Item>
              <Link to={`/read-article/${item.article_id}`}>
                <ArticleCard
                  article={item}
                />
              </Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default CollectArticles;
