import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class RegisterMemberForm extends Shadow() {
  constructor (...args) {
    super(...args)
  }

  connectedCallback () {
    this.render()
    this.renderCss()
  }

  renderCss () {
    this.css = `
            :host {
                background-color: rgba(0,0,0,0.2);
                padding: 1rem;
            }
            #registerForm {
                       display: grid;
                       grid-template: "a b"
                                      "c d"
                                      "e f"
                                      "g h"
                                      "i j"
                                      "k";  
            }
           #registerForm > input[type=text],
           #registerForm > input[type=password],
           #registerForm > input[type=email] {
                margin-bottom: 1rem;
                padding: 0.5rem;
                font-size: 1.25rem:
            }

           #registerForm > button {
                padding: 0.5rem;
                font-weight: 600;
                font-size: 1.25rem;
                padding: 0.5rem;
                color: white;
                background-color: #000000;
            }

           #registerForm > button:hover {
                color: var(--color-tertiary);
                cursor: pointer;
            }

           #registerForm > :nth-child(11) {
                margin: 1rem 0;
                justify-self: end;
            }
            
           #registerForm > label {
                font-weight: 600;
            }

        `
  }

  render () {
    this.html = `
      <div id="registerForm">
        <label>
          Name: 
        </label>
        <input type="text" id="lastName" name="lastName">
        <label>
          Vorname: 
        </label>
        <input type="text" id="firstName" name="firstName">
        <label>
          Email: 
        </label>
        <input type="email" id="email" name="email">
        <label>
          Passwort: 
        </label>
        <input type="password" id="password" name="password">
        <label>
          Passwort wiederholen: 
        </label>
        <input type="password" id="repeatPassword" name="repeatPassword">
        <button id="submitButton">Senden</button>
      </div>
      <div id="message" style="display: none;"></div>
    `

    this.root.querySelector('#submitButton').addEventListener('click', () => this.submit())
    this.updateView()
  }

  updateView () {
    const formDiv = this.root.querySelector('#registerForm')
    const messageDiv = this.root.querySelector('#message')

    if (this._isRegistered) {
      formDiv.style.display = 'none'
      messageDiv.style.display = 'block'
    } else {
      formDiv.style.display = 'grid'
      messageDiv.style.display = 'none'
    }
  }

  async submit () {
    const lastName = this.root.querySelector('#lastName').value
    const firstName = this.root.querySelector('#firstName').value
    const email = this.root.querySelector('#email').value
    const password = this.root.querySelector('#password').value
    const repeatPassword = this.root.querySelector('#repeatPassword').value

    if (password !== repeatPassword) {
      this.showMessage('Passwörter stimmen nicht überein!', 'error')
      return
    }

    const data = {
      email,
      password,
      firstName,
      lastName
    }

    try {
      const response = await fetch('/api/registerMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Fehler beim Senden der Anforderung')
      }

      this.showMessage('Erfolgreich registriert!', 'success')
      this._isRegistered = true
    } catch (error) {
      this.showMessage(error.message, 'error')
    }

    this.updateView()
  }

  showMessage (message, type) {
    const messageDiv = this.root.querySelector('#message')
    messageDiv.textContent = message
    messageDiv.classList.add(type)
    this.updateView()
  }
}
