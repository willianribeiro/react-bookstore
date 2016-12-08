import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import CustomInput from './components/CustomInput';
import FormSubmit from './components/FormSubmit';
import ErrorHandler from './ErrorHandler';

class BookBox extends Component {
  constructor() {
    super();
    this.state = {
      books : [],
      authors: []
    };
  }

  componentDidMount() {
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/livros',
      dataType: 'json',
      success: function(response) {
        this.setState({ books : response });
      }.bind(this)
    });

    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: function(response) {
        this.setState({ authors : response });
      }.bind(this)
    });

    PubSub.subscribe('book:updateBooks', function(topic, response) {
      this.setState({ books : response});
    }.bind(this));
  }

  render() {
    return(
      <div>
        <div className="header">
            <h1>Cadastro de livros</h1>
        </div>
        <div className="content" id="content">
          <BookForm authors={ this.state.authors }></BookForm>
          <BookTable books={ this.state.books }></BookTable>
        </div>
      </div>
    );
  }
}

class BookTable extends Component {
  render() {
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Livro</th>
            <th>Autor</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.books.map(function(book) {
              return (
                <tr key={ book.id }>
                  <td>{ book.titulo }</td>
                  <td>{ book.autor.nome }</td>
                  <td>{ book.preco }</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

class BookForm extends Component {
  constructor() {
    super();
    this.state = {
      title : '',
      authorId : '',
      price : ''
    };
    this.sendForm = this.sendForm.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setPrice = this.setPrice.bind(this);
    this.setAuthorId = this.setAuthorId.bind(this);
  }

  setTitle(event) {
    this.setState({ title : event.target.value });
  }

  setPrice(event) {
    this.setState({ price : event.target.value });
  }

  setAuthorId(event) {
    this.setState({ authorId : event.target.value });
  }

  sendForm(event) {
    var data;
    event.preventDefault();
    data = {
      titulo : this.state.title,
      preco : this.state.price,
      autorId : this.state.authorId
    };

    $.ajax({
      type: 'post',
      url: 'http://cdc-react.herokuapp.com/api/livros',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(data),
      success: function(response) {
        this.setState({
          title: '',
          price: '',
          authorId: ''
        })
        PubSub.publish('book:updateBooks', response);
      }.bind(this),
      error: function(response) {
        if (response.status === 400) {
          new ErrorHandler().publishErrors(response.responseJSON);
        }
      },
      beforeSend: function() {
        PubSub.publish('formValidator:clearErrors', {});
      }
    });
  }

  render() {
    return(
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={ this.sendForm }>
          <CustomInput
            id="titulo"
            type="text"
            name="titulo"
            value={ this.state.title }
            onChange={ this.setTitle }
            label="Título do livro">
          </CustomInput>
          <CustomInput
            id="preco"
            type="text"
            name="preco"
            value={ this.state.price }
            onChange={ this.setPrice }
            label="Preço">
          </CustomInput>
          <div className="pure-control-group">
            <label htmlFor="autorId" >{ this.props.label }</label>
            <select value={ this.state.authorId } name="autorId" id="autorId" onChange={ this.setAuthorId }>
              <option value="">--Selecione um autor--</option>
              {
                this.props.authors.map(function(author) {
                  return <option value={ author.id } key={ author.id }>{ author.nome }</option>
                })
              }
            </select>
            <span>
              { this.state.errorMsg }
            </span>
          </div>

          <FormSubmit label="Gravar"></FormSubmit>
        </form>
      </div>
    );
  }
}

export default BookBox;
