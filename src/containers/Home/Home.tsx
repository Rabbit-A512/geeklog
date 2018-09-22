import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { Card, Col, Row } from "antd";
import LatestComments from "../../components/LatestComments/LatestComments";
import HostestArticles from "../../components/HostestArticles/HostestArticles";

const Meta = Card.Meta;

class Home extends React.Component<RouteComponentProps<any, StaticContext, any>> {

  public componentDidMount() {
    console.log(this.props);
    // this.props.history.replace('/login');
    console.log('ls', localStorage.getItem('a'));
  }

  public render() {
    return (
      <div
        style={{
          padding: '5%'
        }}
      >
        <Card
          hoverable={true}
          title={'为专业用户打造的在线编辑平台'}
          style={{
            margin: '30px auto'
          }}
        >
          <h1 style={{fontSize: '100px'}}>Geeklog</h1>
          <Meta
            description={'使用Markdown语法，提供流畅的书写体验'}
            style={{
              textAlign: 'left'
            }}
          />
        </Card>
        <Row>
          <Col span={6} offset={0}>
            <LatestComments/>
          </Col>
          <Col span={17} offset={1}>
            <HostestArticles/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
