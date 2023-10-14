import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class Login extends Shadow() {

    constructor(...args) {
        super(...args);
    }

    connectedCallback() {
        this._isLoggedIn = localStorage.getItem('username') && localStorage.getItem('token');
        console.log(this._isLoggedIn);
        this.render();
        this.renderCss();
    }


    renderCss() {
        this.css = `
            :host {
                background-color: rgba(0,0,0,0.2);
                padding: 1rem;
            }
            #authForm {
                display: grid;
                grid-template: "a b"
                               "c d"
                               "e";       
            }
            #authForm > input[type=text] {
                margin-bottom: 1rem;
            }

            #authForm > input[type=submit] {
                padding: 0.5rem;
                border-radius: 10px;
                font-weight: 600;
            }
            
            #authForm > :nth-child(5) {
                margin: 1rem 0;
                justify-self: end;
            }


        `;
    }

    render() {
        this.html = `
          <form id="authForm">
            <label for="username">${this.getAttribute('label-username')}:</label>
            <input type="text" id="username" name="username">
            <label for="password">${this.getAttribute('label-password')}:</label>
            <input type="password" id="password" name="password">
            <input type="submit" value="${this.getAttribute('label-login-button')}">
          </form>
          <div id="logoutDiv" style="display: none;">
            <div id="loginInfo"></div>
            <button id="logoutButton">${this.getAttribute('label-logout-button')}</button>
          </div>
        `;

        this.root.querySelector('input[type="submit"]').addEventListener('click', () => this.login());
        this.root.querySelector('#logoutButton').addEventListener('click', () => this.logout());
        this.updateView();
    }


    updateView() {
        const form = this.root.querySelector('#authForm');
        const logoutDiv = this.root.querySelector('#logoutDiv');
        const loginInfo = this.root.querySelector('#loginInfo');

        

        if (this._isLoggedIn) {
            form.style.display = 'none';
            logoutDiv.style.display = 'block';
            loginInfo.innerHTML = `${this.getAttribute('welcome-text').replace('[[username]]', `<strong>${localStorage.getItem('username')}</strong>`)}`; 
        } else {
            form.style.display = 'grid';
            logoutDiv.style.display = 'none';
        }
    }

    async login() {
        const username = this.root.querySelector('#username').value;
        const password = this.root.querySelector('#password').value;

        const response = await fetch('/api/login', {
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
            this._isLoggedIn = false;
            return;
        }

        this._isLoggedIn = true;
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.displayName);
        this.updateView();
    }

    async logout() {


        const response = await fetch('/api/logout', {
            method: 'GET'
        });
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        if (!response.ok) {
            console.error('Logout fehlgeschlagen:', response.status);
            return;
        }
        this._isLoggedIn = false;
        this.updateView();
    }
}
