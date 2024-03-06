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

class LineTool extends pixma.Tool {
    constructor(app) {
        super("line", app);

        this._icon = "line-tool";
        this.customSizeState = new pixma.State(1);
    }

    onUp(layer, mouse) {
        super.onUp(layer, mouse);
        if (!this.brush) return;

        this.brush.drawLine(
            layer.context,
            mouse.start.x,
            mouse.start.y,
            mouse.pos.x,
            mouse.pos.y,
        )
    }

    get sizeState() {
        return this.customSizeState;
    }
}

class RainbowTool extends pixma.DrawingTool {
    constructor(app) {
        super("rainbow", app);
    }

    createButton() {
        const button = new pixma.Button();
        const image = pixma.testImage.cloneNode();
        image.style.width = "32px";
        
        button.inner.append(image);
        button.addEventListener("click", ()=> this.choose());
        return button;
    }

    drawPreview(previewLayer, mouse) {
        const size = previewLayer.manager.project.app.brushes.size;
        previewLayer.context.drawImage(pixma.testImage, mouse.pos.x, mouse.pos.y, size, size);
    }
    draw(layer, mouse) {
        const size = layer.manager.project.app.brushes.size;
        layer.context.fillStyle = pixma.Color.random().getRgbString();

        pixma.Algorithms.line(
            mouse.last.x, mouse.last.y,
            mouse.pos.x, mouse.pos.y,
            (x, y)=> layer.context.fillRect(x, y, size, size)
        )
    }
}

return {
    title: "test plugin",
    author: "bogdanov",

    load() {
        pixma.app.tabs.open(new CustomTab(pixma.app.tabs));
        pixma.app.registerTool("line", a=> new LineTool(a));
        pixma.app.registerTool("rainbow", a=> new RainbowTool(a));
    },
    unload() {

    }
}
