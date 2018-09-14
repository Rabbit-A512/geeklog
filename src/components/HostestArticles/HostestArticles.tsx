import * as React from 'react';
import axios from 'axios';
import { List } from "antd";
import { FakeArticle } from "../../models/article";

import ArticleCard from '../ArticleCard/ArticleCard';
import { Link } from "react-router-dom";

class HostestArticles extends React.Component {

  public state = {
    articles: []
  };

  public componentDidMount() {
    axios.get('http://jsonplaceholder.typicode.com/posts')
      .then(response => {
        const hotArticles = response.data.slice(0, 5);
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
          renderItem={(item: FakeArticle) => (
            <List.Item>
              <Link to={`/read-article/${item.id}`}>
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
