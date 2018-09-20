import * as React from 'react';
import TextArea from "antd/lib/input/TextArea";
import { Button, Card, Divider, Form, List, message } from "antd";
import server from '../../utils/server';
import { getAuthServer } from "../../utils/server";
import { AxiosError, AxiosResponse } from "axios";
import { Comment } from "../../models/comment";
import axios from 'axios';

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
}

class FullComments extends React.Component<IProps> {

  public state: IState = {
    comments: Array<Comment>(),
    modalVisible: false
  };

  public loadComments = () => {
    server.get(`/articles/${this.props.article_id}/comments?page=1&size=10`)
      .then((res: AxiosResponse) => {
        const comments = res.data.data.entities;
        console.log(comments);
        this.setState({
          comments
        });
      })
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
            this.loadComments();
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
    this.loadComments();
  }

  public componentWillUnmount() {
    axios.CancelToken.source().cancel();
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
                  comment={item}
                />
              </Item>
            )}
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
