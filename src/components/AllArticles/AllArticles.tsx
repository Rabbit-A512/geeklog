import * as React from 'react';
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Article } from "../../models/article";
import { List } from "antd";
import CategorySelector from "../CategorySelector/CategorySelector";
import IconText from '../IconText/IconText';

class AllArticles extends React.Component {

  public state = {
    page: 1,
    size: 5,
    total: 0,
    category_id: null,
    articles: Array<Article>()
  };

  public loadAllArticles(page: number): void {
    let url = `/articles?page=${page}&size=${this.state.size}`;
    if (this.state.category_id) {
      url += `&category_id=${this.state.category_id}`;
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
    //
    // const categoryId = id === -1 ? null : id;
    //
    // this.setState({
    //   category_id: categoryId
    // });
    //
    // console.log(this.state);
    //
    // this.loadAllArticles(1);
  };

  public handlePageChange = (page: number) => {
    this.loadAllArticles(page);
  };

  public componentDidMount() {
    this.loadAllArticles(1);
  }

  public render() {

    console.log(this.state);

    return (
      <div
        style={{
          maxWidth: '900px',
          width: '80%',
          margin: 'auto'
        }}
      >
        <CategorySelector
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
            <List.Item
              actions={[
                <IconText type={'star-o'} text={'100'} key={0}/>,
                <IconText type={'like-o'} text={'120'} key={1}/>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                // description={item.content.length > 20 ? item.content.substr(0, 20) + '...' : item.content}
                description={item.tags}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default AllArticles;
