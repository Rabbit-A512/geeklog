import * as React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';

interface IProps {
  tags: string[];
  onTagsChange(newTags: string[]): void;
}

class TagEditor extends React.Component<IProps> {
  public state = {
    tags: Array<string>(),
    inputVisible: false,
    inputValue: '',
  };

  public input: Input;

  public handleClose = (removedTag: string) => {
    const tags = this.props.tags.filter(tag => tag !== removedTag);
    this.setState({
      tags
    });
    this.props.onTagsChange(tags);
  };

  public showInput = () => {
    this.setState({
      inputVisible: true
    }, () => this.input.focus());
  };

  public handleInputChange = (e: any) => {
    this.setState({
      inputValue: e.target.value.trim()
    });
  };

  public handleInputConfirm = () => {
    const inputValue = this.state.inputValue;
    let tags = this.props.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
    this.props.onTagsChange(tags);
  };

  public saveInput = (input: Input) => this.input = input;

  public componentDidMount() {
    this.setState({
      tags: this.props.tags
    });
  }

  public render() {

    const { inputVisible, inputValue } = this.state;
    const tags = this.props.tags;

    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={true}
              afterClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.slice(0, 2)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInput}
            type={'text'}
            style={{ width: 78 }}
            value={inputValue}
            maxLength={15}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{
              backgroundColor: '#fff',
              borderStyle: 'dashed'
            }}
          >
            <Icon type={'plus'}/> 新标签
          </Tag>
        )}
      </div>
    );
  }
}

export default TagEditor;
