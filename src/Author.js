import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

import CustomInput from './components/CustomInput';
import FormSubmit from './components/FormSubmit';
import ErrorHandler from './ErrorHandler';

export default class AuthorBox extends Component {
  constructor() {
    super();
    this.state = { authors : [] };
  }

  componentDidMount() {
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: function(response) {
        console.log('Lista de autores chegou');
        this.setState({ authors : response});
      }.bind(this)
    });

    PubSub.subscribe('author:updateAuthors', function(topic, authors) {
      this.setState({ authors : authors });
    }.bind(this));
  }

  render() {
    return (
      <div>
        <div className="header">
            <h1>Cadastro de autores</h1>
        </div>
        <div className="content" id="content">
          <AuthorForm></AuthorForm>
          <AuthorTable authors={ this.state.authors }></AuthorTable>
        </div>
      </div>
    );
  }
}

class AuthorTable extends Component {
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.authors.map(function(author) {
                return (
                  <tr key={author.id}>
                    <td>{ author.nome }</td>
                    <td>{ author.email }</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class AuthorForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: ''
    };
    this.sendForm = this.sendForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  setName(event) {
    this.setState({ name: event.target.value });
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  // Function called when submit form
  sendForm(event) {
    console.log('sendForm() foi chamado...');

    event.preventDefault();
    var data;
    data = {
      nome: this.state.name,
      email: this.state.email,
      senha: this.state.password
    };

    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      contentType: 'application/json',
      type: 'post',
      data: JSON.stringify(data),
      success: function(response) {
        console.log('Dados gravados com sucesso.');
        PubSub.publish('author:updateAuthors', response);
        this.setState({
          name: '',
          email: '',
          password: ''
        });
      }.bind(this),
      error: function(response) {
        console.log('Erro ao gravar dados.');
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
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={ this.sendForm }>
          <CustomInput
            id="nome"
            type="text"
            name="nome"
            value={ this.state.name }
            onChange={ this.setName }
            label="Nome">
          </CustomInput>

          <CustomInput
            id="email"
            type="text"
            name="email"
            value={ this.state.email }
            onChange={ this.setEmail }
            label="E-mail">
          </CustomInput>

            <CustomInput
              id="password"
              type="password"
              name="senha"
              value={ this.state.password }
              onChange={ this.setPassword }
              label="Senha">
            </CustomInput>

            <FormSubmit label="Gravar"></FormSubmit>
        </form>
      </div>
    );
  }
}
