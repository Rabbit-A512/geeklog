import * as React from 'react';
import axios from '../../utils/server';
import { List } from "antd";
import { Article } from "../../models/article";

import ArticleCard from '../ArticleCard/ArticleCard';
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";

class HostestArticles extends React.Component {

  public state = {
    articles: Array<Article>()
  };

  public componentDidMount() {
    axios.get('/articles/hot/5')
      .then((res: AxiosResponse<{ data: Article[] }>) => {
        const hotArticles = res.data.data;
        this.setState({
          articles: hotArticles
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  public render() {
    return (
      <div
        style={{
          width: '100%'
        }}
      >
        <List
          bordered={true}
          header={<h2>最热文章</h2>}
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

export default HostestArticles;
