import * as React from 'react';
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Article } from "../../models/article";
import { List } from "antd";
import CategorySelector from "../CategorySelector/CategorySelector";
import ArticleCard from "../ArticleCard/ArticleCard";

class AllArticles extends React.Component {

  public state = {
    page: 1,
    size: 5,
    total: 0,
    category_id: -1,
    articles: Array<Article>()
  };

  public loadAllArticles(page: number, categoryId: number): void {
    let url = `/articles?page=${page}&size=${this.state.size}`;
    if (categoryId !== -1) {
      url += `&category_id=${categoryId}`;
    }
    server.get(url)
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
  }

  public handleCategoryChange = (id: number) => {

    this.setState({
      category_id: id
    });

    this.loadAllArticles(1, id);
  };

  public handlePageChange = (page: number) => {
    this.loadAllArticles(page, this.state.category_id);
  };

  public componentDidMount() {
    // category_id = -1 stands for all categories
    this.loadAllArticles(1, -1);
  }

  public render() {

    return (
      <div
        style={{
          maxWidth: '900px',
          width: '80%',
          margin: '100px auto'
        }}
      >
        <h2>选择文章分类</h2>
        <CategorySelector
          defaultCategory_id={-1}
          showAllCategories={true}
          categoryChangeHandler={this.handleCategoryChange}
        />
        <List 
          dataSource={this.state.articles}
          pagination={{
            pageSize: this.state.size,
            onChange: this.handlePageChange,
            total: this.state.total
          }}
          renderItem={(item: Article) => (
            <List.Item>
              <ArticleCard
                article={item}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default AllArticles;
