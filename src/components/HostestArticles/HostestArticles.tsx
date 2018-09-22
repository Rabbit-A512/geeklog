import * as React from 'react';
import server from '../../utils/server';
import { List } from "antd";
import { Article } from "../../models/article";

import ArticleCard from '../ArticleCard/ArticleCard';
import { AxiosResponse } from "axios";

class HostestArticles extends React.Component {

  public state = {
    articles: Array<Article>()
  };

  public componentDidMount() {
    server.get('/articles/hot/5')
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
      <List
        className={'w-100'}
        bordered={true}
        header={(
          <h2>
            最热文章&nbsp;

          </h2>
        )}
        dataSource={this.state.articles}
        renderItem={(item: Article) => (
          <List.Item>
            <ArticleCard
              article={item}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default HostestArticles;
