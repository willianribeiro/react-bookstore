import React, { Component } from 'react';
import $ from 'jquery';

class Book extends Component {
  constructor() {
    super();
    this.state = {
      books : []
    }
  }

  componentDidMount() {
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/livros',
      dataType: 'json',
      success: function(response) {
        this.setState({ books : response });
      }.bind(this)
    });
  }

  render() {
    return(
      <div>
        <div className="header">
            <h1>Cadastro de livros</h1>
        </div>
        <div className="content" id="content">
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
                this.state.books.map(function(book) {
                  return (
                    <tr key={book.id}>
                      <td>{ book.titulo }</td>
                      <td>{ book.autor.nome }</td>
                      <td>{ book.preco }</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Book;
