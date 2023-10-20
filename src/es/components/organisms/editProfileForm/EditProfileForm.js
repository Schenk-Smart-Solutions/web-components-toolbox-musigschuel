import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class EditProfileForm extends Shadow() {

    constructor(...args) {
        super(...args);
    }


    connectedCallBack() {

    }

    renderCss() { }


    render() {
        this.html = `
            <div id="edit-form">
                <label></label>
            </div>

        `;     
    }


}