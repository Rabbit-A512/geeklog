import * as React from 'react';
import { Comment } from "../../models/comment";
import { Button, Card, Form, Modal, message, Pagination, List } from "antd";
import Avatar from "antd/lib/avatar";
import TextArea from "antd/lib/input/TextArea";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { getCurrentUser } from "../../utils/auth";
import server, { getAuthServer } from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";

const Meta = Card.Meta;
const Item = List.Item;

interface IProps {
  comment: Comment;
  form: WrappedFormUtils;
  show_sub: boolean;
  loadRootComments:() => void;
}

class CommentCard extends React.Component<IProps> {

  public state = {
    modalVisible: false,
    sub_comments: Array<Comment>(),
    page: 1,
    size: 5,
    total: 10
  };


  public showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  public handleOk = (e: any) => {
    console.log(this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);

        const currentUser = getCurrentUser();

        const reqBody = {
          content: values.comment,
          user_id: currentUser.user_id,
          article_id: this.props.comment.article_id,
          parent_id: this.props.comment.comment_id,
        };

        const authServer = getAuthServer();

        authServer.post('/comments', reqBody)
          .then((res: AxiosResponse) => {
            console.log(res);
            this.loadSubComments(1);
            this.props.loadRootComments();
            this.setState({
              modalVisible: false
            });
          })
          .catch((error: AxiosError) => {
            console.log(error);
          });

        this.setState({
          modalVisible: false
        });
      } else {
        message.warning('回复内容不能为空！');
      }
    }));
  };

  public handleCancel = (e: any) => {
    console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  public handlePageSizeChange = (page: number, size: number) => {
    this.loadSubComments(page);
  };

  public loadSubComments = (page: number) => {

    const url = `/comments/${this.props.comment.comment_id}/sub_comments?page=${page}&size=${this.state.size}`;

    server.get(url)
      .then((res: AxiosResponse) => {
        const subComments = res.data.data ? res.data.data.entities : [];
        console.log(subComments);
        const total = res.data.data ? res.data.data.total : 0;
        this.setState({
          sub_comments: subComments,
          total
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    this.loadSubComments(1);
  }

  public render() {

    const { getFieldDecorator } = this.props.form;

    const WrappedComment = Form.create()(CommentCard);

    const subComments = this.props.show_sub ? (
      <Card
        bordered={false}
        style={{
          paddingLeft: '30px',
          display: this.state.sub_comments.length > 0 ? 'inherit' : 'none'
        }}
      >
        <List
          itemLayout={'horizontal'}
          dataSource={this.state.sub_comments}
          renderItem={(item: Comment) => (
            <Item
            >
              <WrappedComment
                loadRootComments={() => this.loadSubComments(1)}
                show_sub={false}
                comment={item}
              />
            </Item>
          )}
        />
        <Pagination
          size={'small'}
          total={this.state.total}
          pageSize={this.state.size}
          onChange={this.handlePageSizeChange}
        />
      </Card>
    ) : null;

    return (
      <Card
        bordered={false}
      >
        <Meta
          avatar={<Avatar icon={'user'}/>}
          title={`user_id: ${this.props.comment.user_id}`}
          description={this.props.comment.content}
        />
        <Button
          onClick={this.showModal}
          icon={'message'}
          htmlType={'button'}
        />
        <Modal
          title={`回复给${this.props.comment.user_id}`}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: '回复不能为空'
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
        </Modal>
        {subComments}
      </Card>
    );
  }
}

const wrappedCommentCard = Form.create()(CommentCard);

export default wrappedCommentCard;
