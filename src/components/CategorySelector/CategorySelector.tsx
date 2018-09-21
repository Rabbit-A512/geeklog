import * as React from 'react';
import { Category } from "../../models/category";
import { Select } from "antd";
import axios from "../../utils/server";
import { AxiosResponse } from "axios";

const Option = Select.Option;

interface IProps {
  showAllCategories: boolean;
  categoryChangeHandler(value: number): void;
}

class CategorySelector extends React.Component<IProps> {

  public state = {
    categories: Array<Category>()
  };

  public componentDidMount() {
    axios.get('/categories')
      .then((res: AxiosResponse<{ data: Category[] }>) => {
        const categories = res.data.data;
        this.setState({
          categories
        });
      })
  }

  public render() {
    return (
      <Select
        defaultValue={1}
        onChange={this.props.categoryChangeHandler}
        style={{
          width: '150px'
        }}
      >
        {this.state.categories.map(category => (
          <Option key={category.category_id} value={category.category_id}>
            {category.name}
          </Option>
        ))}
        {this.props.showAllCategories ? (
          <Option key={-1} value={-1}>
            全部
          </Option>
        ) : null}
      </Select>
    );
  }
}

export default CategorySelector;
