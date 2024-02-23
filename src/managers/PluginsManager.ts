import { Manager } from "@base/managers";
import { Dev } from "@base/utils";
import type App from "@source/App";
import { DrawingLayer } from "@source/common/layers";
import { Project } from "@source/common/project";

export default class PluginsManager extends Manager {
    readonly app: App;
    
    constructor(app: App) {
        super();

        this.app = app;

        this.load("plugins/test.js");
    }

    load(path: string) {
        var pixma = {
            Project: Project,
            DrawingLayer: DrawingLayer,
            Dev: Dev,
            Plugin: class {
                app: App;
                title: string;
                constructor(app: App, opts: any) {
                    this.app = app;
                    this.title = opts.title;
                }
                load() {
                    console.log(`Plugin "${ this.title }" loaded!`)
                }
                unload() {
                    console.log(`Plugin "${ this.title }" unloaded...`)
                }
            }
        }
        
        fetch(path, {
            method: "GET",
            headers: { "Content-Type": "plain/text" }
        })
            .then(res=> res)
            .then(data=> data.text())
            .then(text=> {
                const pluginClass = eval(text)
                const plugin = new pluginClass(this.app);
                plugin.load()
            })
            .catch(err=> console.error(err));
    }
}
