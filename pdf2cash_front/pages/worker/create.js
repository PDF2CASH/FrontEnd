import React, { Component } from 'react';
import {
  Button,
  SnackbarContent,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  },
});

class WorkerCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cpf: '',
      email: '',
      password: '',
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeCPF = this.handleChangeCPF.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    document.title = 'Cadastrar funcionário';
  }

  handleChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  handleChangeCPF(event) {
    this.setState({
      cpf: event.target.value,
    });
  }

  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  async handleSubmit(event) {
    const {
      name, cpf, email, password,
    } = this.state;
    event.preventDefault();
    const urlWorker = 'http://0.0.0.0:8008/api/worker/worker/';
    fetch(urlWorker, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        cpf,
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = 'http://localhost:3000/worker';
        } else {
          return response.json()

            .then((json) => {
              const errors = []
              if (json.name) {
                for (let i = 0; i < json.name.length; i += 1) {
                  errors.push(json.name[ i ])
                }
              }
              if (json.cpf) {
                for (let i = 0; i < json.cpf.length; i += 1) {
                  errors.push('Este CPF já está cadastrado no sistema.')
                }
              }
              if (json.email) {
                for (let i = 0; i < json.email.length; i += 1) {
                  errors.push('Este E-mail já está cadastrado no sistema.')
                }
              }
              if (json.password) {
                for (let i = 0; i < json.password.length; i += 1) {
                  errors.push(json.password[ i ])
                }
              }
              this.setState({ errors, errorShow: true });
            })
        }
        return false;
      })
  }

  render() {
    const { classes } = this.props;
    const {
      name, email, cpf, password, errorShow, errors,
    } = this.state;
    return (
        <ValidatorForm
          onSubmit={ this.handleSubmit }
          onError={ error => console.log(error) }
        >
            <h2>CADASTRAR FUNCIONÁRIO</h2>
            {
                    errorShow && errors.map(
                      error => (
                          <SnackbarContent
                            key={ error }
                            className={ classes.snackbar }
                            message={ error }
                          />
                      ),
                    )
                }
            <div className="form_worker">
                <TextValidator
                  label="Nome"
                  onChange={ this.handleChangeName }
                  name="name"
                  value={ name }
                  validators={ [ 'required', 'minStringLength:9' ] }
                  errorMessages={ [ 'Este campo é obrigatório', 'Digite um nome válido' ] }
                />
                <br />
                <TextValidator
                  label="CPF"
                  onChange={ this.handleChangeCPF }
                  name="cpf"
                  inputProps={ { maxLength: 11 } }
                  value={ cpf }
                  validators={ [ 'required', 'matchRegexp:^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$' ] }
                  errorMessages={ [ 'Este campo é obrigatório', 'Digite um CPF válido' ] }
                />
                <br />
                <TextValidator
                  label="E-mail"
                  onChange={ this.handleChangeEmail }
                  name="email"
                  value={ email }
                  validators={ [ 'required', 'isEmail' ] }
                  errorMessages={ [ 'Este campo é obrigatório', 'Este e-mail não é válido' ] }
                />
                <br />
                <TextValidator
                  label="Senha"
                  onChange={ this.handleChangePassword }
                  name="password"
                  type="password"
                  value={ password }
                  validators={ [ 'required', 'minStringLength:6', 'maxStringLength:30' ] }
                  errorMessages={ [ 'Este campo é obrigatório', 'Digite uma senha maior que 6 dígitos', 'Digite uma senha menor que 30 dígitos' ] }
                />
                <br />
            </div>
            <Button type="submit" variant="contained" color="primary">
                    CADASTRAR
            </Button>
        </ValidatorForm>
    );
  }
}

export default withStyles(styles)(WorkerCreate);
