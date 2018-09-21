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

class StarArticles extends React.Component<IProps> {

  public state = {
    articles: Array<Article>(),
    page: 1,
    size: 10,
    total: 0
  };

  public loadArticles = (page: number) => {
    server.get(`/users/${this.props.user_id}/star/articles?page=${page}&size=${this.state.size}`)
      .then((res: AxiosResponse) => {
        const articles = res.data.data ? res.data.data.entities : [];
        const total = res.data.data ? res.data.data.total : 0;
        this.setState({
          articles,
          total
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public handlePageChange = (page: number) => {
    this.loadArticles(page);
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
          pagination={{
            pageSize: this.state.size,
            onChange: this.handlePageChange,
            total: this.state.total
          }}
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

export default StarArticles;
