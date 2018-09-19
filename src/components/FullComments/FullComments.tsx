import * as React from 'react';
import TextArea from "antd/lib/input/TextArea";
import { Button, Card, Divider, Form, List, message } from "antd";
import server from '../../utils/server';
import { AxiosResponse } from "axios";
import { Comment } from "../../models/comment";
import axios from 'axios';

import CommentCard from '../CommentCard/CommentCard';
import { WrappedFormUtils } from "antd/lib/form/Form";

const Item = List.Item;

interface IProps {
  article_id: number;
  form: WrappedFormUtils;
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

  public handleCommentSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
      } else {
        message.warn('评论不能为空！');
      }
    });
  };

  public componentDidMount() {

    console.log('[fullComment]', this.props.article_id);

    server.get(`/articles/${this.props.article_id}/comments?page=1&size=10`)
      .then((res: AxiosResponse<{ data: Comment[] }>) => {
        const comments = res.data.data;
        this.setState({
          comments
        });
      })
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
