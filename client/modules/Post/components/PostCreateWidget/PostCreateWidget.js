import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import ReactDOM from 'react-dom'
import { Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {CSVDownload, CSVLink} from 'react-csv';
// import monkeylearn from 'monkeylearn'

var MonkeyLearn = require('monkeylearn');

import ReactTable from 'react-table'
// import 'react-table/react-table.css'


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
      domain: defaultDomain,
      current_file_name: '',
      sentiment_data: [],
      classify_data: []
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
      let self = this;
      p.then(function (res) {
          self.setState({
            result: res.result[0],
            summary_text: '',
            show_aspect_based: false,
            sentiment_data: [],
            classify_data: []
          })
      });
    } else if (this.state.current_file_name){
      let self = this;
      axios.get('https://python-nlp-api.herokuapp.com/topic_modeling?filename=' + this.state.current_file_name)
         .then( (response_value) => {
           console.log("response: ", response_value.data.result);
            self.setState({
                result: [],
                summary_text: '',
                show_aspect_based: false,
                sentiment_data: response_value.data.result,
                classify_data: []
            });
         })
         .catch( (error) => {
           console.log(error);
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
            sentiment_data: [],
            classify_data: []
          })
      });
    } else if (this.state.current_file_name){
      let self = this;
      axios.get('https://python-nlp-api.herokuapp.com/classify?filename=' + this.state.current_file_name)
         .then( (response_value) => {
           console.log("response: ", response_value.data.result);
            self.setState({
                result: [],
                summary_text: '',
                show_aspect_based: false,
                sentiment_data: [],
                classify_data: response_value.data.result
            });
         })
         .catch( (error) => {
           console.log(error);
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
            sentiment_data: [],
            classify_data: []
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
        sentiment_data: [],
        classify_data: []
      })
      this.props.aspectBased(textRef.value, domain)
    }
  };

  uploadFile = () => {
    if (this.refs.my_file){
      var file = $('#upload-input').get(0).files[0]

      if (file){
        this.refs.content.value = ''

        var formData = new FormData();
        formData.append('uploads_file', file, file.name);

        let self = this
        $.ajax({
          url: 'https://python-nlp-api.herokuapp.com/uploads',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(response){
              console.log('upload successful!\n' + response.filename);
              self.setState({
                  current_file_name: response.filename,
                  result: [],
                  summary_text: '',
                  show_aspect_based: false,
              })
          }
        });
      }
    }
  }

  handleClick = () => {
      ReactDOM.findDOMNode(this.refs.my_file).value = "";
  }

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
    if (this.state.sentiment_data.length > 0){
      console.log("this.state.sentiment_data: ", this.state.sentiment_data)
      var headers = [
         {label: 'Text', key: 'string'},
         {label: 'Topic 0', key: 'topic_0_name'},
         {label: 'Topic 0 probability', key: 'topic_0_proba'},
         {label: 'Topic 1', key: 'topic_1_name'},
         {label: 'Topic 1 probability', key: 'topic_1_proba'},
         {label: 'Topic 2', key: 'topic_2_name'},
         {label: 'Topic 2 probability', key: 'topic_2_proba'}];

       const columns = [{
         Header: 'Text',
         accessor: 'string' // String-based value accessors!
       }, {
         Header: 'Topic 0',
         accessor: 'topic_0_name',
       }, {
         Header: 'Topic 0 Percentage',
         accessor: 'topic_0_proba',
         Cell: props => <span className='number'>{Number((props.value).toFixed(1))}</span> // Custom cell components!
       },{
         Header: 'Topic 1',
         accessor: 'topic_1_name',
       }, {
         Header: 'Topic 1 Percentage',
         accessor: 'topic_1_proba',
         Cell: props => <span className='number'>{Number((props.value).toFixed(1))}</span> // Custom cell components!
       }, {
         Header: 'Topic 2',
         accessor: 'topic_2_name',
       }, {
         Header: 'Topic 2 Percentage',
         accessor: 'topic_2_proba',
         Cell: props => <span className='number'>{Number((props.value).toFixed(1))}</span> // Custom cell components!
       }];

      element.push(<CSVLink data={this.state.sentiment_data}
            headers={headers}
            filename={"sentiment_data.csv"}
            className="btn btn-primary"
            target="_blank">
              Download result
          </CSVLink>);

      element.push(<br/>)

      element.push(<ReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={this.state.sentiment_data}
          columns={columns}/>)

      this.handleClick();

    }
    if (this.state.classify_data.length > 0){
      console.log("this.state.classify_data: ", this.state.classify_data)
      var headers = [
         {label: 'Text', key: 'string'},
         {label: 'Polarity', key: 'polarity'}];

         const columns = [{
           Header: 'Text',
           accessor: 'string',
           minWidth: 350
         }, {
           Header: 'Polarity',
           accessor: 'polarity',
         }];
      element.push(<CSVLink data={this.state.classify_data}
            headers={headers}
            filename={"classify_data.csv"}
            className="btn btn-primary"
            target="_blank">
              Download result
          </CSVLink>);

      element.push(<br/>)

      element.push(<ReactTable
            defaultPageSize={10}
            className="-striped -highlight"
            data={this.state.classify_data}
            columns={columns}/>)
      this.handleClick();
    }


    return (
      <div>
        <Grid>
              <Row className="show-grid">
                  <Col xs={6} md={6}>
                    <div className={styles['form-content']}>
                      <h2 className={styles['form-title']}>Upload CSV file</h2>
                      <input className={styles['form-field']} id="upload-input" type="file" name="uploads" ref="my_file" onChange={this.uploadFile}/>
                      <h2 className={styles['form-title']}>OR insert text </h2>
                      <textarea placeholder="Please insert your text" className={styles['form-field']} ref="content" />
                      <h2 className={styles['form-title']}>Text domain</h2>
                      <select className={styles['form-field']} value={this.state.domain} onChange={this.selectDomain}>
                        <option key="restaurants" value="restaurants" >Restaurant</option>
                        <option key="hotels" value="hotels">Hotels</option>
                      </select>
                      <a className={styles['post-submit-button']} onClick={this.topicModeling} href="#">Topic extracter</a>
                      <a className={styles['post-submit-button-right']} onClick={this.sentimentClassify} href="#">Classify</a>
                      <a className={styles['post-submit-button-right']} onClick={this.summary} href="#">Summary text</a>
                      <a className={styles['post-submit-button-right-5']} onClick={this.aspectBased} href="#">Aspect based analysis</a>
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
