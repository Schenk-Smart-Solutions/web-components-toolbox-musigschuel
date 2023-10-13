import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class  Value extends Shadow() {
    constructor(...args) {
        super(...args);
    }





    connectedCallback() {
        if (this.shouldComponentRenderCSS()) this.renderCSS();
        if (this.shouldComponentRenderHTML()) this.renderHTML();
    }


    disconnectedCallback() {

    }

    shouldComponentRenderHTML() {
        return !this.root.querySelector('div');
    }

    shouldComponentRenderCSS() {
        return !this.root.querySelector('style[_css]');
    }

    renderCSS() {
        this.css = `
            :host {
                width: 100%;
            }
            
            .label {
                font-size: 1.25rem;
                font-weight: 400;
            }
            

            .line {
                height: 1px;
                width: 60%;
                background-color: #000000;
            }

            .value {
                width: 60%;
                margin-top: 0.25rem;
                display: flex;
                justify-content: flex-end;
            }
        `;
    }

    renderHTML() {
        this.container = document.createElement('DIV');
        this.label = document.createElement('LABEL');
        this.label.className = 'label';
        this.label.innerText = this.getAttribute('label');
        this.container.appendChild(this.label);
        this.line = document.createElement('DIV');
        this.line.className = 'line';
        this.container.appendChild(this.line);
        this.value = document.createElement('DIV');
        this.value.className = 'value';
        this.value.innerText = this.getAttribute('value');
        this.container.appendChild(this.value);
        this.html = this.container;
    }
};