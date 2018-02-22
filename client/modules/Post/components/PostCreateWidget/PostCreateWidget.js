import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import ReactDOM from 'react-dom'
import { Grid, Row, Col } from 'react-bootstrap';
// import monkeylearn from 'monkeylearn'

var MonkeyLearn = require('monkeylearn');


// Import Style
import styles from './PostCreateWidget.css';
var defaultDomain = 'restaurants';


export class PostCreateWidget extends Component {
  constructor() {
    super();
    this.selectDomain = this.selectDomain.bind(this)

    this.state = {
      result: [],
      summary_text: '',
      show_aspect_based: false,
      domain: defaultDomain
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      domain: this.state.domain
    })
  }

  componentWillUpdate(nextProps, nextState) {

  }

  selectDomain(e) {
    this.setState({
      domain: e.target.value
    })
  }

  topicModeling = () => {
    const contentRef = this.refs.content;
    if (contentRef.value) {
      var ml = new MonkeyLearn('8d78185efa69f65994a472c27d9a12a62b3ed402');
      var module_id = 'cl_hS9wMk9y';
      var text_list = [contentRef.value];
      var p = ml.classifiers.classify(module_id, text_list, false);
      let self = this
      p.then(function (res) {
          self.setState({
            result: res.result[0],
            summary_text: '',
            show_aspect_based: false,
          })
      });
    }
  };

  sentimentClassify = () => {
    const contentRef = this.refs.content;

    if (contentRef.value) {
      var ml = new MonkeyLearn('8d78185efa69f65994a472c27d9a12a62b3ed402');
      var module_id = 'cl_Jx8qzYJh';
      var text_list = [contentRef.value];
      var p = ml.classifiers.classify(module_id, text_list, false);
      let self = this
      p.then(function (res) {
          self.setState({
            result: res.result[0],
            summary_text: '',
            show_aspect_based: false,
          })
      });
    }
  };

  summary = () => {
    const contentRef = this.refs.content;
    if (contentRef.value) {
      var ml = new MonkeyLearn('8d78185efa69f65994a472c27d9a12a62b3ed402');
      var module_id = 'ex_94WD2XxD';
      var text_list = [contentRef.value];
      var p = ml.extractors.extract(module_id, text_list);
      let self = this
      p.then(function (res) {
          self.setState({
            summary_text: res.result[0]['parsed_value'],
            result: [],
            show_aspect_based: false,
          })
      });
    }
  };

  aspectBased = () => {
    var textRef = this.refs.content;
    var domain =  this.state.domain;
    if (textRef.value && domain) {
      this.setState({
        summary_text: '',
        result: [],
        show_aspect_based: true,
      })
      this.props.aspectBased(textRef.value, domain)
    }
  };

  render() {
    let element = []
    if (this.state.result.length > 0){
        element.push(<div>
                        <span className={styles['left-bold']}>Label</span>
                        <span className={styles['right-bold']}>Probability</span>​
                     </div>);
        for(var i=0; i<this.state.result.length; i++){
          element.push(
            <div>
              <span className={styles['left']}>{this.state.result[i]['label']}</span>
              <span className={styles['probability-value-right']}>{this.state.result[i]['probability']}</span>​
            </div>)
        }
    };
    if (this.state.summary_text.length > 0){
      element.push(<div><span className={styles['left-bold']}>Summary</span>​</div>);
      element.push(<div><span>{this.state.summary_text}</span>​</div>);
    };

    if (this.props.data.length > 0 && this.state.show_aspect_based) {
      if (this.props.data[0]['aspects'].length > 0){
        element.push(<div>
                        <span className={styles['left-bold']}>Aspect</span>
                        <span className={styles['right-bold']}>Polarity</span>​
                     </div>);
        for(var i=0; i<this.props.data[0]['aspects'].length; i++){
          element.push(
            <div>
              <span className={styles['left']}>
                  {this.props.data[0]['aspects'][i]['aspect']}
                  <b className={styles['ui']}> {this.props.data[0]['aspects'][i]['aspect_confidence'].toFixed(2)} </b>
              </span>
              <span className={styles['probability-value-right']}>
                  {this.props.data[0]['aspects'][i]['polarity']}
                  <b className={styles['ui']}> {this.props.data[0]['aspects'][i]['polarity_confidence'].toFixed(2)} </b>
              </span>​
            </div>)
        }
      }
    }
    return (
      <div>
        <Grid>
              <Row className="show-grid">
                  <Col xs={6} md={6}>
                    <div className={styles['form-content']}>
                      <h2 className={styles['form-title']}>Your text</h2>
                      <textarea placeholder="Please insert your text" className={styles['form-field']} ref="content" />
                      <h2 className={styles['form-title']}>Text domain</h2>
                      <select className={styles['form-field']} value={this.state.domain} onChange={this.selectDomain}>
                        <option key="restaurants" value="restaurants" >Restaurant</option>
                        <option key="hotels" value="hotels">Hotels</option>
                      </select>
                      <a className={styles['post-submit-button']} onClick={this.topicModeling} href="#">Topic extracter</a>
                      <a className={styles['post-submit-button-right']} onClick={this.sentimentClassify} href="#">Classify</a>
                      <a className={styles['post-submit-button-right']} onClick={this.summary} href="#">Summary text</a>
                      <a className={styles['post-submit-button-right-5']} onClick={this.aspectBased} href="#">Aspect-Based</a>
                    </div>
                  </Col>
                  <Col xs={6} md={6}>
                    <div className={styles['form-content']}>
                      <h2 className={styles['form-title']}>Result</h2>
                    </div>
                    < div id="result">{element}</div>
                  </Col>
              </Row>
          </Grid>
      </div>
    );
  }
}

PostCreateWidget.propTypes = {
  aspectBased: PropTypes.func.isRequired,
  data: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(PostCreateWidget);
