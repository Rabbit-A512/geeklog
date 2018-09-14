import * as React from 'react';
import { FakeComment } from "../../models/comment";
import { List } from "antd";
import Avatar from "antd/lib/avatar";
import axios from 'axios';

class LatestComments extends React.Component {

  public state = {
    comments: []
  };

  public componentDidMount() {
    axios.get('http://jsonplaceholder.typicode.com/comments')
      .then(response => {
        console.log(response.data);
        const latestComments = response.data.slice(0, 5);
        this.setState({
          comments: latestComments
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  public render() {
    return (
      <List
        header={<h2>最新评论</h2>}
        bordered={true}
        itemLayout={'horizontal'}
        dataSource={this.state.comments}
        renderItem={(item: FakeComment) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={'user'}/>}
              title={item.name}
              description={item.body}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default LatestComments;
