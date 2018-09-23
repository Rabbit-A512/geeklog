import * as React from 'react';
import TextArea from "antd/lib/input/TextArea";
import { Button, Card, Divider, Form, List, Pagination } from "antd";
import server from '../../utils/server';
import { getAuthServer } from "../../utils/server";
import { AxiosError, AxiosResponse } from "axios";
import { Comment } from "../../models/comment";
import { RouteComponentProps, withRouter } from "react-router";
import CommentCard from '../CommentCard/CommentCard';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { getCurrentUser } from "../../utils/auth";

const Item = List.Item;

interface IProps extends RouteComponentProps{
  article_id: number;
  form: WrappedFormUtils;
  onCommentSendFailure(error: AxiosError): void;
}

interface IState {
  comments: Comment[];
  modalVisible: boolean;
  page: number;
  size: number;
  total: number;
  can_comment: boolean;
}

class FullComments extends React.Component<IProps> {

  public state: IState = {
    comments: Array<Comment>(),
    modalVisible: false,
    page: 1,
    size: 5,
    total: 0,
    can_comment: true
  };

  public loadComments = (page: number) => {
    server.get(`/articles/${this.props.article_id}/comments?page=${page}&size=${this.state.size}`)
      .then((res: AxiosResponse) => {
        const comments = res.data.data ? res.data.data.entities : [];
        const total = res.data.data ? res.data.data.total : 0;
        console.log(comments);
        this.setState({
          comments,
          total
        });
      })
  };

  public handlePageSizeChange = (page: number, size: number) => {
    this.loadComments(page);
  };

  public handleCommentSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);

        const currentUser = getCurrentUser();

        const reqBody = {
          user_id: currentUser.user_id,
          article_id: this.props.article_id,
          parent_id: null,
          content: values.comment
        };

        const authServer = getAuthServer();

        authServer.post('/comments', reqBody)
          .then((res: AxiosResponse) => {
            console.log(res);
            this.props.form.setFieldsValue({
              comment: ''
            });
            this.loadComments(1);
          })
          .catch((error: AxiosError) => {
            console.log(error);
            this.props.onCommentSendFailure(error);
          });
      }
    });
  };

  public componentDidMount() {
    this.loadComments(1);

    // set can_comment state field
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.replace('/login');
      return;
    }
    server.get(`/users/${currentUser.user_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            can_comment: res.data.data.can_comment
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {

    const { getFieldDecorator } = this.props.form;

    const submitComment = this.state.can_comment ? (
      <div>
        {getFieldDecorator('comment', {
          rules: [
            {
              message: '评论不能为空！',
              required: true
            },
            {
              message: '评论长度需要大于5小于300',
              min: 5,
              max: 300
            }
          ]
        })(
          <TextArea
            autosize={{
              minRows: 2,
              maxRows: 8
            }}
          />
        )}
        <Button
          onClick={this.handleCommentSubmit}
          htmlType={'button'}
          style={{
            marginTop: '10px'
          }}
        >
          提交
        </Button>
      </div>
    ) : (
      <p
        style={{
          fontSize: 'large',
          color: 'red'
        }}
      >
        您的评论权限已经被管理员冻结，请联系管理员QQ:2654525303申请解冻。
      </p>
    );

    return (
      <div>
        <Divider />
        <Card
          title={<h3>所有评论</h3>}
        >
          <List
            itemLayout={'horizontal'}
            dataSource={this.state.comments}
            renderItem={(item: Comment) => (
              <Item
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <CommentCard
                  show_reply_btn={true}
                  loadRootComments={() => null}
                  show_sub={true}
                  comment={item}
                />
              </Item>
            )}
          />

          <Pagination
            pageSize={this.state.size}
            onChange={this.handlePageSizeChange}
            total={this.state.total}
          />

          <Divider orientation={'left'}>发表评论</Divider>
          {submitComment}
        </Card>
      </div>
    );
  }
}

const wrappedFullComments = Form.create()(FullComments);

export default withRouter(wrappedFullComments);
