import * as React from 'react';
import { Link, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { Button, Card, Col, Row } from "antd";
import LatestComments from "../../components/LatestComments/LatestComments";
import HostestArticles from "../../components/HostestArticles/HostestArticles";
import AllCategories from "../../components/AllCategories/AllCategories";

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
        <Card
          title={<h2>社区涉及的领域</h2>}
          extra={(
            <Link to={'/all-articles'}>
              <Button
                htmlType={'button'}
                size={'large'}
              >
                所有文章
              </Button>
            </Link>
          )}
          style={{
            marginBottom: '30px'
          }}
        >
          <AllCategories/>
        </Card>
        <Row>
          <Col span={8} offset={0}>
            <LatestComments/>
          </Col>
          <Col span={15} offset={1}>
            <HostestArticles/>
          </Col>
        </Row>
        <p
          style={{
            textAlign: 'center',
            color: '#333',
            marginTop: '30px'
          }}
        >
          开发团队：云南大学软件学院2015级
        </p>
      </div>

    );
  }
}

export default Home;
