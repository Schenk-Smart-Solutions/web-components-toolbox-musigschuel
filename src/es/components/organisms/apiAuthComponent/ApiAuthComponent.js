import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class ApiAuthComponent extends Shadow() {



    constructor(...args) {
        super(...args);
        

    }

    connectedCallback() {
        this._isLoggedIn = this.getAttribute("is-logged-in");
        console.log(this._isLoggedIn);
        this.render();
    }



    render() {
        this.html = `
      <form style="display: ${this._isLoggedIn ? 'none' : 'block'};" id="authForm">
        <label for="username">Benutzername:</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">Passwort:</label><br>
        <input type="password" id="password" name="password"><br><br>
        <input type="button" value="Absenden">
      </form>
      <div id="logoutDiv" style="display: ${this._isLoggedIn ? 'block' : 'none'};">
        <button id="logoutButton">Logout</button>
      </div>
    `;

        this.root.querySelector('input[type="button"]').addEventListener('click', () => this.login());
        this.root.querySelector('#logoutButton').addEventListener('click', () => this.logout());
        this.updateView();
    }

    updateView() {
        const form = this.root.querySelector('#authForm');
        const logoutDiv = this.root.querySelector('#logoutDiv');

        console.log("update view");
        if (this._isLoggedIn) {
            form.style.display = 'none';
            logoutDiv.style.display = 'block';
        } else {
            form.style.display = 'block';
            logoutDiv.style.display = 'none';
        }
    }

    async login() {
        const username = this.root.querySelector('#username').value;
        const password = this.root.querySelector('#password').value;

        const response = await fetch('/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            console.error('Authentifizierung fehlgeschlagen:', response.status);
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);

        // Verstecken Sie das Formular und zeigen Sie den Logout-Button an
        this.root.querySelector('#authForm').style.display = 'none';
        this.root.querySelector('#logoutDiv').style.display = 'block';
        location.reload();
    }

    async logout() {
        // Entfernen Sie das Token und zeigen Sie das Formular erneut an
     
        const response = await fetch('/api/logout', {
            method: 'GET'
        });
        localStorage.removeItem('token');

        if (!response.ok) {
            console.error('Logout fehlgeschlagen:', response.status);
            return;
        }
        this.root.querySelector('#authForm').style.display = 'block';
        this.root.querySelector('#logoutDiv').style.display = 'none';
        location.reload();
    }
}
