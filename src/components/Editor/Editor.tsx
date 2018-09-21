import * as React from 'react';
import { FormEvent } from 'react';
import Input from "antd/lib/input/Input";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Button from "antd/lib/button/button";
import { Card, Divider, Drawer, Icon, Select, Switch, Tabs } from "antd";
import * as ReactMarkdown from 'react-markdown';
import { UnControlled as CodeMirror } from "react-codemirror2";
import { withRouter } from "react-router";

import CodeBlock from "../CodeBlock/CodeBlock";
import TextArea from "antd/lib/input/TextArea";

import CategorySelector from "../CategorySelector/CategorySelector";
import { RouteComponentProps } from "react-router";
import { getCurrentUser } from "../../utils/auth";
import TagEditor from "./TagEditor/TagEditor";
import { EditingArticle } from "../../models/article";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

interface IProps extends RouteComponentProps {
  form: WrappedFormUtils;
  category_id?: number;
  tags?: string[];
  title?: string;
  source?: string;
  onArticleChange: (article: EditingArticle) => void;
}

class Editor extends React.Component<IProps> {

  public state = {
    // internal editor config
    showDrawer: false,
    lineNumbers: true,
    theme: 'monokai',

    // external article input
    category_id: 1,
    tags: Array<string>(),
    title: '你好世界',
    source: `# Hello Markdown

\`\`\`javascript
var a = 2;
console.log('Hello, world!');
\`\`\`

`
  };

  public categoryChangeHandler = (value: number) => {
    this.setState({
      category_id: value
    });
  };

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
            tags: this.state.tags.join(','),
            // hard code category_id to 1 as the default value
            category_id: this.state.category_id || 1,
            user_id: currentUser.user_id
          };
          this.props.onArticleChange(temp);
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

  public handleTagsChange = (newTags: string[]) => {
    this.setState({
      tags: newTags
    });
  };

  public componentDidMount() {
    const { category_id, title, tags, source } = this.props;
    if (category_id) {
      this.setState({
        category_id
      });
    }
    if (title) {
      this.setState({
        title
      });
    }
    if (tags) {
      this.setState({
        tags
      });
    }
    if (source) {
      this.setState({
        source
      });
    }
  }

  public render() {

    const getFieldDecorator = this.props.form.getFieldDecorator;

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
            <TagEditor
              tags={this.state.tags}
              onTagsChange={this.handleTagsChange}
            />
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
                <TagEditor
                  tags={this.state.tags}
                  onTagsChange={this.handleTagsChange}
                />
                <Divider>文章分类</Divider>
                <CategorySelector
                  defaultCategory_id={1}
                  showAllCategories={false}
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

export default withRouter(WrappedEditor);
