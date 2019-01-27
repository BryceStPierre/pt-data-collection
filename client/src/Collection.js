import React, { Component } from 'react';

import { 
  Container, Row, Col, Button, 
  Form, FormGroup, Label, Input
} from 'reactstrap';

import { 
  FaMicrophoneAlt, FaPlus, FaPaperPlane
} from 'react-icons/fa';

import MetaEntryCreate from './MetaEntryCreate';
import MetaEntrySelect from './MetaEntrySelect';

import receive from './utils/receive';
import send from './utils/send';

const defaultState = {
  data: '',
  stage: 2,
  domain: 0,
  category: 0,
  newDomain: '',
  newCategory: '',
  domainsList: [],
  categoriesList: [],  
  flags: {
    newDomain: false,
    newCategory: false
  }
};

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }
  
  componentDidMount () {
    document.title = 'Data Collection | Bryce St. Pierre';
    this.getDomainsList();
  }

  getDomainsList = () => {
    receive('/api/domain', list => {
      this.setState({ domainsList: list });
    });
  }

  getCategoriesList = (domain) => {
    receive(`/api/category/${domain}`, list => {
      this.setState({ categoriesList: list });
    });
  }

  handleNewEntryToggle = (e) => {
    let flags = Object.assign({}, this.state.flags);
    flags[e.target.value] = true;
    this.setState({ flags });
  }

  handleNewEntrySubmit = (e) => {
    let flags = Object.assign({}, this.state.flags);
    flags[e.target.value] = false;
    let name = e.target.value;

    if (e.target.value === 'newDomain') {
      send('/api/domain', {
        domain: this.state.newDomain
      }, res => {
        this.getDomainsList();
        this.resetNewEntry(name, flags);
      });
    } else if (e.target.value === 'newCategory') {
      send('/api/category', {
        domain: this.state.domain,
        categoryLabel: this.state.newCategory
      }, res => {
        this.getCategoriesList(this.state.domain);
        this.resetNewEntry(name, flags);
      });
    }
  }

  handleNewEntryCancel = (e) => {
    let flags = Object.assign({}, this.state.flags);
    flags[e.target.value] = false;

    this.resetNewEntry(e.target.value, flags);
  }

  resetNewEntry = (name, flags) => {
    this.setState({
      [name]: '',
      flags: flags
    });
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleMetaChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleRecord = (e) => {

  };

  handleSubmitData = (e) => {
    e.preventDefault();

    send('/api/data', {
      domain: this.state.domain,
      category: this.state.category,
      data: this.state.data
    }, res => {
      console.log(res);
      this.setState(defaultState);
    });
  };

  render () {
    const { newDomain, newCategory } = this.state.flags;

    return (
      <Container className={'mt-4'}>
        <Row className={'mb-3'}>
          <Col>
            <h3>Collection</h3>
          </Col>
        </Row>
        <Row className={'justify-content-center'}>
          <Col sm={10} md={10} lg={10} xl={8}>
            <Form onSubmit={this.handleSubmitData}>
              { !newDomain && <MetaEntrySelect
                name='domain'
                label='Domain'
                singular='domain'
                plural='domains'
                list={this.state.domainsList}
                onMetaChange={this.handleMetaChange} /> }

              { !newDomain && <FormGroup className={'text-center'}>
                <Button 
                  color='primary' 
                  value='newDomain' 
                  onClick={this.handleNewEntryToggle}>
                  New Domain&ensp;<FaPlus />
                </Button>
              </FormGroup> }

              { newDomain && <MetaEntryCreate
                  name='newDomain'
                  value={this.state.newDomain}
                  label='New Domain'
                  placeholder='New domain, topic, data of interest...'
                  onRecord={this.handleRecord}
                  onCreate={this.handleNewEntrySubmit}
                  onCancel={this.handleNewEntryCancel}
                  onInputChange={this.handleInputChange}>
                <FaMicrophoneAlt />
              </MetaEntryCreate> }

              { this.state.stage > 0 && !newCategory && <MetaEntrySelect 
                name='category'
                label='Category'
                singular='category'
                plural='categories'
                list={this.state.categoriesList}
                onMetaChange={this.handleMetaChange} /> }

              { this.state.stage > 0 && !newCategory && <FormGroup className={'text-center'}>
                <Button 
                  color='primary' 
                  value='newCategory' 
                  onClick={this.handleNewEntryToggle}>
                  New Category&ensp;<FaPlus />
                </Button>
              </FormGroup> }

              { newCategory && <MetaEntryCreate
                  name='newCategory'
                  value={this.state.newCategory}
                  label='New Category'
                  placeholder='New category, classification, grouping...'
                  onRecord={this.handleRecord}
                  onCreate={this.handleNewEntrySubmit}
                  onCancel={this.handleNewEntryCancel}
                  onInputChange={this.handleInputChange}>
                <FaMicrophoneAlt />
              </MetaEntryCreate> }

              { this.state.stage > 0 && <FormGroup>
                <Label for='data'>Data</Label>
                <Input 
                  id='data' 
                  name='data' 
                  type='textarea'
                  value={this.state.data} 
                  onChange={this.handleInputChange}
                  placeholder='Text, description, information...' />
              </FormGroup> }

              { this.state.stage > 0 && <FormGroup className={'text-center'}>
                <Button color='danger' onClick={this.handleRecord}>Record&ensp;<FaMicrophoneAlt /></Button>{' '}
                <Button color='success' type='submit'>Submit&ensp;<FaPaperPlane /></Button>
              </FormGroup> }
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Collection;
