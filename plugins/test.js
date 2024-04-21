const NAMESPACE = "my-plugin";

class LineTool extends pixma.DrawingTool {
    constructor(app) {
        super(NAMESPACE, "line", app);

        this._iconName = "line-tool";
        this.customSizeState = new pixma.State(1);
		this.keymap(["3", "l"]);
    }

	use() {}

    onUp(layer, mouse) {
        super.onUp(layer, mouse);

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
        super(NAMESPACE, "rainbow", app);

		this.keymap(["4"]);
    }

    createButton() {
        const button = new pixma.Button();
        const image = pixma.testImage.cloneNode();
        image.style.width = "32px";
        
        button.inner.append(image);
        button.addEventListener("click", ()=> this.choose());
        return button;
    }

    drawPreview(context, mouse) {
        context.drawImage(pixma.testImage, mouse.pos.x, mouse.pos.y, this.size, this.size);
    }
    use(layer, mouse) {
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
        pixma.app.registerTool("line", new LineTool(pixma.app));
        pixma.app.registerTool("rainbow", new RainbowTool(pixma.app));

		pixma.app.brushes.frontColorState.listen(color=> {
			if (pixma.app.currentTool.name == "erase") {
				pixma.app.tools.choose(pixma.app.tools.get("pen"));
			}
		})
    },
    unload() {

    }
}
