import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class RegisterMemberForm extends Shadow() {

    constructor(...args) {
        super(...args);
    }

    connectedCallback() {
        this.render();
        this.renderCss();
    }

    renderCss() {
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
            }

           #registerForm > input[type=submit] {
                padding: 0.5rem;
                border-radius: 10px;
                font-weight: 600;
            }

           #registerForm > :nth-child(11) {
                margin: 1rem 0;
                justify-self: end;
            }

        `;
    }

    render() {
        this.html = `
      <form id="registerForm">
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
        <input type="submit" value="Absenden">
      </form>
      <div id="message"></div>
    `;

        this.root.querySelector('#registerForm').addEventListener('submit', this.submitForm.bind(this));
    }

    async submitForm(e) {
        e.preventDefault();

        const lastName = this.root.querySelector('#lastName').value;
        const firstName = this.root.querySelector('#firstName').value;
        const email = this.root.querySelector('#email').value;
        const password = this.root.querySelector('#password').value;
        const repeatPassword = this.root.querySelector('#repeatPassword').value;

        if (password !== repeatPassword) {
            this.showMessage('Passwörter stimmen nicht überein!', 'error');
            return;
        }

        const data = {
            email,
            password,
            firstName,
            lastName
        };

        try {
            const response = await fetch('/api/registerMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Fehler beim Senden der Anforderung');
            }

            this.showMessage('Erfolgreich registriert!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    showMessage(message, type) {
        const messageDiv = this.root.querySelector('#message');
        messageDiv.textContent = message;
        messageDiv.classList.add(type);
    }
}

