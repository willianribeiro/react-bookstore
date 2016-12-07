import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from './components/CustomInput';
import FormSubmit from './components/FormSubmit';
import './css/pure-min.css';
import './css/side-menu.css';

class App extends Component {
  constructor() {
    console.log('constructor() foi chamado...');
    super();
    this.state = {
      authors : [],
      name: '',
      email: '',
      password: ''
    };
    this.sendForm = this.sendForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  // Runs before render()
  componentWillMount() {
    console.log('componentWillMount() foi chamado...');
  }

  // Runs after render()
  componentDidMount() {
    console.log('componentDidMount() foi chamado...');
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: function(response) {
        console.log('Resposta chegou');
        this.setState({ authors : response });
      }.bind(this)
    });
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
        this.setState({ authors : response });
      }.bind(this),
      error: function(response) {
        console.log('Erro ao gravar dados.');
      }
    });
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

  // Runs every time state is changed
  render() {
    console.log('render() foi chamado...');
    return (
      <div id="layout">
          <a href="#menu" id="menuLink" className="menu-link">
              <span></span>
          </a>

          <div id="menu">
              <div className="pure-menu">
                  <a className="pure-menu-heading" href="#">Company</a>

                  <ul className="pure-menu-list">
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
                    </ul>
              </div>
          </div>

          <div id="main">
              <div className="header">
                  <h1>Cadastro de autores</h1>
              </div>
              <div className="content" id="content">
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
                        name="password"
                        value={ this.state.password }
                        onChange={ this.setPassword }
                        label="Senha">
                      </CustomInput>

                      <FormSubmit label="Gravar"></FormSubmit>
                  </form>
                </div>
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
                        this.state.authors.map(function(author) {
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
            </div>
          </div>
      </div>
    );
  }
}

export default App;
