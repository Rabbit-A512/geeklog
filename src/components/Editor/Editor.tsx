import * as React from 'react';
import Input from "antd/lib/input/Input";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Button from "antd/lib/button/button";
import { FormEvent } from "react";
import { Tabs, Select, Card, Switch, Drawer, Tag, Tooltip, Icon, Divider } from "antd";
import * as ReactMarkdown from 'react-markdown';
import { UnControlled as CodeMirror } from "react-codemirror2";

import CodeBlock from "./CodeBlock";
import TextArea from "antd/lib/input/TextArea";

import './Editor.css';
import CategorySelector from "../CategorySelector/CategorySelector";
import { Category } from "../../models/category";
import axios from '../../utils/server';
import { AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router";
import { getCurrentUser } from "../../utils/auth";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

interface IProps extends RouteComponentProps {
  form: WrappedFormUtils
}

class Editor extends React.Component<IProps> {


  public state = {
    showDrawer: false,
    category_id: null,
    categories: Array<Category>(),
    tagEditor: {
      tags: Array<string>(),
      inputVisible: false,
      inputValue: '',
    },
    theme: 'monokai',
    title: '你好世界',
    lineNumbers: true,
    source: `# Hello Markdown

\`\`\`javascript
var a = 2;
console.log('Hello, world!');
\`\`\`

`
  };

  private input: Input;

  public categoryChangeHandler = (value: number) => {
    this.setState({
      category_id: value
    });
  };

  public tagCloseHandler = (removedTag: string) => {
    const tags = this.state.tagEditor.tags.filter(tag => tag !== removedTag);
    console.log(tags);

    const tagEditor = {...this.state.tagEditor};
    tagEditor.tags = tags;
    this.setState({
      tagEditor
    });
  };

  public showInput = () => {
    const tagEditor = {...this.state.tagEditor};
    tagEditor.inputVisible = true;
    this.setState({tagEditor}, () => this.input.focus());
  };

  public inputChangeHandler = (e: any) => {
    const tagEditor = {...this.state.tagEditor};
    console.log(e);
    console.log(typeof e);
    tagEditor.inputValue = e.target.value;
    this.setState({
      tagEditor
    })
  };

  public inputConfirmHandler = () => {
    let tagEditor = {...this.state.tagEditor};
    const inputValue = tagEditor.inputValue;
    let tags = tagEditor.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }

    console.log(tags);
    tagEditor = {
      tags,
      inputValue: '',
      inputVisible: false
    };
    this.setState({
      tagEditor
    })
  };

  public saveInputRef = (input: Input) => this.input = input;

  public showDrawer = () => {
    this.setState({
      showDrawer: true
    });
  };

  public drawerCloseHandler = () => {
    this.setState({
      showDrawer: false
    });
  };

  public formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {

        const currentUser = getCurrentUser();
        if (!currentUser) {
          this.props.history.replace('/login');
        } else {
          const temp = {
            ...values,
            tags: this.state.tagEditor.tags.join(','),
            // hard code category_id to 1 as the default value
            category_id: this.state.category_id || 1,
            user_id: currentUser.user_id
          };
          console.log('[New Article]', temp);
        }
      }
    });
  };

  public themeChangeHandler = (value: string) => {
    this.setState({
      theme: value
    });
  };

  public toggleLineNumberHandler = (value: boolean) => {
    this.setState({
      lineNumbers: value
    });
  };

  public componentDidMount() {
    axios.get('/categories')
      .then((res: AxiosResponse<{ data: Category[] }>) => {
        const categories = res.data.data;
        console.log(categories);
        this.setState({
          categories
        });
      })
  }

  public render() {

    const getFieldDecorator = this.props.form.getFieldDecorator;

    const { tags, inputVisible, inputValue } = this.state.tagEditor;

    return (
      <div>
        <h2
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >新的文章</h2>

        <Form onSubmit={this.formSubmitHandler}>
          <FormItem
            label={"标题"}
            style={{
              maxWidth: '500px',
            }}
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  message: '文章标题不能为空',
                  required: true
                }
              ],
              initialValue: this.state.title
            })(
              <Input
                id={'title'}
                disabled={false}
                type={'text'} />
            )}
          </FormItem>
          <FormItem
            style={{
              display: 'none'
            }}
          >
            {getFieldDecorator('content', {
              initialValue: this.state.source
            })(
              <TextArea
              />
            )}
          </FormItem>
          <div
            style={{
              marginBottom: '10px'
            }}
          >
            {tags.map((tag, index) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag
                  key={tag}
                  closable={true}
                  afterClose={() => this.tagCloseHandler(tag)}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type={'text'}
                size={'small'}
                style={{width: 78}}
                value={inputValue}
                onChange={this.inputChangeHandler}
                onBlur={this.inputConfirmHandler}
                onPressEnter={this.inputConfirmHandler}
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
          <Tabs
            tabBarExtraContent={(
              <Button
                htmlType={'button'}
                type={'dashed'}
                onClick={this.showDrawer}
                style={{
                  marginBottom: '10px'
                }}
              >
                <Icon type={'sliders'}/>控制面板
              </Button>
            )}
            defaultActiveKey={'1'}
            type={'card'}
            style={{
              marginBottom: '10px'
            }}
          >
            <TabPane tab={'编辑'} key={'1'}>
              <Drawer
                title={'控制面板'}
                visible={this.state.showDrawer}
                placement={'right'}
                closable={false}
                onClose={this.drawerCloseHandler}
              >
                <Divider>主题</Divider>
                <Select
                  defaultValue={'monokai'}
                  onChange={this.themeChangeHandler}
                  style={{
                    width: '200px',
                    marginBottom: '10px',
                    marginLeft: 'auto'
                  }}
                >
                  <OptGroup label={'暗色主题'}>
                    <Option value={'monokai'}>Monokai</Option>
                    <Option value={'material'}>Material</Option>
                    <Option value={'the-matrix'}>The Matrix</Option>
                  </OptGroup>
                  <OptGroup label={'亮色主题'}>
                    <Option value={'mdn-like'}>mdn-like</Option>
                    <Option value={'paraiso-light'}>paraiso-light</Option>
                    <Option value={'base16-light'}>base16-light</Option>
                  </OptGroup>
                </Select>
                <Divider>行号</Divider>
                <div>
                  <span>是否显示行号</span>&nbsp;
                  <Switch
                    size={'small'}
                    defaultChecked={true}
                    onChange={this.toggleLineNumberHandler}
                  />
                </div>
                <Divider>标签</Divider>
                <div>
                  {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag
                        key={tag}
                        closable={true}
                        afterClose={() => this.tagCloseHandler(tag)}
                      >
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                  })}
                  {inputVisible && (
                    <Input
                      ref={this.saveInputRef}
                      type={'text'}
                      size={'small'}
                      style={{width: 78}}
                      value={inputValue}
                      onChange={this.inputChangeHandler}
                      onBlur={this.inputConfirmHandler}
                      onPressEnter={this.inputConfirmHandler}
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
                <Divider>文章分类</Divider>
                <CategorySelector
                  categories={this.state.categories}
                  categoryChangeHandler={this.categoryChangeHandler}
                />
              </Drawer>
              <CodeMirror
                value={this.state.source}
                options={{
                  mode: 'markdown',
                  theme: this.state.theme,
                  lineNumbers: this.state.lineNumbers,
                  viewportMargin: Infinity,
                  placeholder: 'Welcome!'
                }}
                onChange={(editor, data, value) => {
                  this.props.form.setFieldsValue({
                    content: value
                  })
                }}
              />
            </TabPane>
            <TabPane tab={'预览'} key={'2'}>
              <Card

              >
                <ReactMarkdown
                  source={this.props.form.getFieldValue('content')}
                  renderers={{
                    code: CodeBlock
                  }}
                />
              </Card>
            </TabPane>
          </Tabs>
          <Button type={'primary'} htmlType={'submit'}>提交</Button>
        </Form>
      </div>

    );
  }
}

const WrappedEditor = Form.create()(Editor);

export default WrappedEditor;
