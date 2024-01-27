import App from "./App";
import "./styles/style.scss";

addEventListener("DOMContentLoaded", ()=> {
    const app = new App();
    document.body.append(app.element);
})

