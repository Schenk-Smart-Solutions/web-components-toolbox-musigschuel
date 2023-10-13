import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class RegisterMemberForm extends Shadow() {

    constructor(...args) {
        super(...args);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.html = `
      <form id="registerForm">
        <label>
          Name: <input type="text" id="lastName" name="lastName">
        </label>
        <label>
          Vorname: <input type="text" id="firstName" name="firstName">
        </label>
        <label>
          Email: <input type="email" id="email" name="email">
        </label>
        <label>
          Passwort: <input type="password" id="password" name="password">
        </label>
        <label>
          Passwort wiederholen: <input type="password" id="repeatPassword" name="repeatPassword">
        </label>
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

