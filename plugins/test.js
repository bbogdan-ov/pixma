(function() {
    class TestPlugin extends pixma.Plugin {
        constructor(app) {
            super(app, {
                title: "Test plugin!",
                author: "bogdanov",
                date: "2024",
                tags: ["test", "hey"]
            })
        }

        load() {
            super.load()

            pixma.Dev.log("hey!!");

            const b = new pixma.Project(this.app, "Plugin project!");
            const l = new pixma.DrawingLayer(b.layers).setDisplayName("plugin layer");
            b.layers.add(l);

            this.app.projects.open(b);
        }
        unload() {
            super.unload()
        }
    }
    
    return TestPlugin;
})()
