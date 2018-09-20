import * as React from 'react';
import TextArea from "antd/lib/input/TextArea";
import { Button, Card, Divider, Form, List, message, Pagination } from "antd";
import server from '../../utils/server';
import { getAuthServer } from "../../utils/server";
import { AxiosError, AxiosResponse } from "axios";
import { Comment } from "../../models/comment";

import CommentCard from '../CommentCard/CommentCard';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { getCurrentUser } from "../../utils/auth";

const Item = List.Item;

interface IProps{
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
}

class FullComments extends React.Component<IProps> {

  public state: IState = {
    comments: Array<Comment>(),
    modalVisible: false,
    page: 1,
    size: 5,
    total: 0
  };

  public loadComments = (page: number) => {
    server.get(`/articles/${this.props.article_id}/comments?page=${page}&size=${this.state.size}`)
      .then((res: AxiosResponse) => {
        const comments = res.data.data ? res.data.data.entities : [];
        const size = this.state.size;
        const total = res.data.data ? Math.ceil(res.data.data.total / size) : 0;
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
            this.loadComments(1);
          })
          .catch((error: AxiosError) => {
            console.log(error);
            this.props.onCommentSendFailure(error);
          });
      } else {
        message.warn('评论不能为空！');
      }
    });
  };

  public componentDidMount() {
    this.loadComments(1);
  }

  public render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Divider />
        <Card
          title={'所有评论'}
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
          {getFieldDecorator('comment', {
            rules: [
              {
                message: '评论不能为空！',
                required: true
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
          >
            提交
          </Button>
        </Card>
      </div>
    );
  }
}

const wrappedFullComments = Form.create()(FullComments);

export default wrappedFullComments;
