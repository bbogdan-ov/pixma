class CustomTab extends pixma.Tab {
    constructor(manager) {
        super(manager)

        this.attachView(new CustomTabView(this));
        this.setTitle("plugin tab!")
    }
}
class CustomTabView extends pixma.TabView {
    constructor(tab) {
        super(tab);

        this.num = 0;
        this.counter = pixma.DOM.span("0");
        this.button = new pixma.Button().setContent("click me!").setColor("primary");

        this.append(this.counter, this.button);
    }

    _updateCounter() {
        this.counter.textContent = this.num.toString()
    }
    
    // On
    onMount() {
        super.onMount();

        this.listen(this.button, "click", ()=> {
            this.num ++;
            this._updateCounter();
        })
    }
}
pixma.DOM.define("custom-tab-view", CustomTabView);

return {
    title: "test plugin",
    author: "bogdanov",

    load() {
        pixma.app.tabs.open(new CustomTab(pixma.app.tabs));
    },
    unload() {

    }
}
