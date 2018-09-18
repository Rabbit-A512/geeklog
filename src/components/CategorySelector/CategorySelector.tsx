import * as React from 'react';
import { Category } from "../../models/category";
import { Select } from "antd";

const Option = Select.Option;

interface IProps {
  categories: Category[];
  categoryChangeHandler(value: number): void;
}

class CategorySelector extends React.Component<IProps> {

  public render() {
    return (
      <Select
        defaultValue={1}
        onChange={this.props.categoryChangeHandler}
        style={{
          width: '150px'
        }}
      >
        {this.props.categories.map(category => (
          <Option key={category.category_id} value={category.category_id}>
            {category.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default CategorySelector;
