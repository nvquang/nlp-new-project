import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import ReactDOM from 'react-dom'
import { Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {CSVDownload, CSVLink} from 'react-csv';
var MonkeyLearn = require('monkeylearn');
import ReactTable from 'react-table'
import SweetAlert from 'sweetalert-react';

// Import Style
import styles from './PostCreateWidget.css';
var defaultDomain = 'restaurants';

import loading_icon from './loading.gif'

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
      absa_data: [],
      classify_data: [],
      show_alert: false,
      alert_title: '',
      alert_content: '',
      is_loading: false
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


  classify = () => {
    const contentRef = this.refs.content;

    this.setState({
      is_loading: true,
    })

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
            absa_data: [],
            classify_data: [],
            show_alert: false,
            is_loading: false,
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
                absa_data: [],
                classify_data: response_value.data.result,
                show_alert: false,
                is_loading: false
            });
         })
         .catch( (error) => {
           console.log(error);
           this.setState({
                 is_loading: false,
                 show_alert: true,
                 alert_title: "ERROR",
                 alert_content: "Error while process the uploaded file!!!"
           });
         });
      this.handleClick();
    } else {
      this.setState({
            is_loading: false,
            show_alert: true,
            alert_title: "WARNING",
            alert_content: "Please insert your text"
      });
    }
  };

  summary = () => {
    const contentRef = this.refs.content;
    this.setState({
      is_loading: true,
    })
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
            absa_data: [],
            classify_data: [],
            show_alert: false,
            is_loading: false
          })
      });
    } else {
      if (this.state.current_file_name) {
        this.setState({
              is_loading: false,
              show_alert: true,
              alert_title: "WARNING",
              alert_content: "This function is not support in file"
        });
      } else {
        this.setState({
              is_loading: false,
              show_alert: true,
              alert_title: "WARNING",
              alert_content: "Please insert your text"
        });
      }

    }
  };

  aspectAnalysis = () => {
    var textRef = this.refs.content;
    var domain =  this.state.domain;
    this.setState({
      is_loading: true,
    })

    console.log("this.state.current_file_name: ", this.state.current_file_name)
    if (textRef.value && domain) {
      this.setState({
        summary_text: '',
        result: [],
        show_aspect_based: true,
        absa_data: [],
        classify_data: [],
        show_alert: false,
        is_loading: false
      })
      this.props.aspectBased(textRef.value, domain)
    } else if (this.state.current_file_name){
      let self = this;
      axios.get('https://python-nlp-api.herokuapp.com/absa?filename=' + this.state.current_file_name)
         .then( (response_value) => {
            self.setState({
                result: [],
                summary_text: '',
                show_aspect_based: false,
                absa_data: response_value.data.result,
                classify_data: [],
                show_alert: false,
                is_loading: false
            });
         })
         .catch( (error) => {
           console.log(error);
           this.setState({
                 is_loading: false,
                 show_alert: true,
                 alert_title: "ERROR",
                 alert_content: "Error while process the uploaded file!!!"
           });
         });
      this.handleClick();
    } else {
      this.setState({
            is_loading: false,
            show_alert: true,
            alert_title: "WARNING",
            alert_content: "Please insert your text"
      });
    }
  };

  uploadFile = () => {
    if (this.refs.my_file){
      this.setState({
        is_loading: true,
      })

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
              console.log('upload successful!' + response.filename);
              self.setState({
                  current_file_name: response.filename,
                  result: [],
                  summary_text: '',
                  show_aspect_based: false,
                  is_loading: false
              });
              console.log("this.state.current_file_name: ", self.state.current_file_name)
          },
          error: function (error) {
              console.log("Error: ", error)
              self.setState({
                is_loading: false,
                show_alert: true,
                alert_title: "ERROR",
                alert_content: "Error while uploading the file!!!"
              });
          }
        });
      }
    }
  }

  handleClick = () => {
      ReactDOM.findDOMNode(this.refs.my_file).value = "";
  }

  fattenAspects = (aspectObject, nbOfAspects) => {
    var fatten = [aspectObject['text']]
    for (var i = 0; i<aspectObject['aspects'].length; i++){
      fatten.push(aspectObject['aspects'][i]['aspect_name'])
      fatten.push(aspectObject['aspects'][i]['aspect_polarity'])
    }

    return fatten
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
    if (this.state.absa_data.length > 0){
      var fatten_absa_data = []
      for (var i = 0; i<this.state.absa_data.length; i++){
        var nb_of_aspect = this.state.absa_data[i]['aspects'].length
        fatten_absa_data.push(this.fattenAspects(this.state.absa_data[i], nb_of_aspect))
      }

      var headers = ['text']
      var nb_of_max_aspects = 3
      for(var i=1; i<=nb_of_max_aspects; i++){
        headers.push('aspect.' + i + '.name')
        headers.push('aspect.' + i +  '.polarity')
      }

      element.push(<CSVLink data={fatten_absa_data}
            headers={headers}
            filename={"absa_data.csv"}
            className="btn btn-primary"
            target="_blank">
              Download result
          </CSVLink>);

      element.push(<br/>)


      const columns = [{
        Header: 'Text',
        accessor: 'text' // String-based value accessors!
      }, {
        Header: 'Topic 1',
        accessor: 'aspects[0][aspect_name]',
      }, {
        Header: 'Topic 1 polarity',
        accessor: 'aspects[0][aspect_polarity]',
      }];

      element.push(<ReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={this.state.absa_data}
          columns={columns}/>)
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
    }
    return (
      <div>
        <SweetAlert
          show={this.state.is_loading}
          title="Please wait a moment"
          imageUrl={loading_icon}
          showConfirmButton = {false}
        />
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
                      <a className={styles['post-submit-button']} onClick={this.aspectAnalysis} href="#">Aspect analysis</a>
                      <a className={styles['post-submit-button-right']} onClick={this.classify} href="#">Classify</a>
                      <a className={styles['post-submit-button-right']} onClick={this.summary} href="#">Summary</a>
                    </div>
                  </Col>
                  <Col xs={6} md={6}>
                    <div className={styles['form-content']}>
                      <h2 className={styles['form-title']}>Result</h2>
                    </div>
                    < div id="result">{element}</div>
                    <SweetAlert
                        show={this.state.show_alert}
                        title={this.state.alert_title}
                        text={this.state.alert_content}
                        onConfirm={() => this.setState({ show_alert: false })}
                      />
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
