import * as React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as CodeStyles from "react-syntax-highlighter/styles/hljs";

class CodeBlock extends React.PureComponent<any> {

  public componentDidMount() {
    console.log(this.props);
  }

  public render() {
    return (
      <SyntaxHighlighter
        language={this.props.language}
        style={CodeStyles.github}
      >
        {this.props.value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;
