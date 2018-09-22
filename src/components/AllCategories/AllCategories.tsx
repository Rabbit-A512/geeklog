import * as React from 'react';
import { Category } from "../../models/category";
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Card, List } from "antd";

class AllCategories extends React.Component {
  public state = {
    categories: Array<Category>()
  };

  public componentDidMount() {
    // get all the categories in the system
    server.get('/categories')
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            categories: res.data.data
          })
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3
        }}
        dataSource={this.state.categories}
        renderItem={(item: Category) => (
          <List.Item>
            <Card
              title={item.name}
            >{item.description}</Card>
          </List.Item>
        )}
      />
    );
  }
}

export default AllCategories;
