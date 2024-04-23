const NAMESPACE = "my-plugin";

class RainbowTool extends pixma.DrawingTool {
    constructor(app) {
        super(NAMESPACE, "rainbow", app);
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
